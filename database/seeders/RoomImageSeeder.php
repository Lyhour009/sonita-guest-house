<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RoomImageSeeder extends Seeder
{
    /**
     * Wikimedia Commons search queries per room type — real, freely-licensed photos
     * (not tied to any specific business) fetched at a fixed 900px width.
     *
     * @var array<string, array<int, string>>
     */
    private const SEARCH_QUERIES = [
        'Standard' => ['budget hotel bedroom interior', 'guesthouse room Cambodia'],
        'Deluxe' => ['hotel deluxe room interior', 'hotel double room interior'],
        'Suite' => ['hotel suite interior', 'hotel junior suite interior'],
        'Family' => ['family hotel room twin beds', 'hotel room bunk beds'],
        'Generic' => ['hotel bathroom interior', 'guesthouse Siem Reap interior'],
    ];

    private const IMAGES_PER_ROOM = 3;

    private const USER_AGENT = 'SonitaGuestHouseThesisSeeder/1.0 (thesis demo project; contact: lyhouromega855@gmail.com)';

    public function run(): void
    {
        $rooms = Room::all();

        if ($rooms->isEmpty()) {
            $this->command->warn('No rooms found. Skipping room image seeding.');

            return;
        }

        $pool = $this->buildPool();

        if (collect($pool)->flatten()->isEmpty()) {
            $this->command->warn('Could not fetch any room photos (no network access?). Skipping room image seeding.');

            return;
        }

        foreach ($rooms as $room) {
            $categoryImages = $pool[$room->room_type] ?? [];
            $selection = $this->pickImages($categoryImages, $pool['Generic'], self::IMAGES_PER_ROOM);

            foreach ($selection as $poolPath) {
                $extension = pathinfo($poolPath, PATHINFO_EXTENSION) ?: 'jpg';
                $destination = "rooms/{$room->id}/".Str::uuid().'.'.$extension;

                Storage::disk('public')->put(
                    $destination,
                    Storage::disk('local')->get($poolPath),
                );

                RoomImage::create([
                    'room_id' => $room->id,
                    'image_path' => $destination,
                ]);
            }
        }
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function buildPool(): array
    {
        $pool = [];

        foreach (self::SEARCH_QUERIES as $category => $queries) {
            $images = [];

            foreach ($queries as $query) {
                $images = [...$images, ...$this->fetchQuery($query)];
            }

            $pool[$category] = $images;
        }

        return $pool;
    }

    /**
     * Downloads (or reuses a previously cached download of) the top real photos for one
     * search query, and returns their local pool paths on the private disk.
     *
     * @return array<int, string>
     */
    private function fetchQuery(string $query): array
    {
        $cacheDir = 'room-image-pool/'.Str::slug($query);

        $cached = Storage::disk('local')->exists($cacheDir) ? Storage::disk('local')->files($cacheDir) : [];

        if ($cached !== []) {
            return $cached;
        }

        try {
            $response = Http::withHeaders(['User-Agent' => self::USER_AGENT])
                ->timeout(15)
                ->get('https://commons.wikimedia.org/w/api.php', [
                    'action' => 'query',
                    'generator' => 'search',
                    'gsrsearch' => $query,
                    'gsrlimit' => 4,
                    'gsrnamespace' => 6,
                    'prop' => 'imageinfo',
                    'iiprop' => 'url|mime',
                    'iiurlwidth' => 900,
                    'format' => 'json',
                ]);
        } catch (\Throwable) {
            return [];
        }

        if (! $response->ok()) {
            return [];
        }

        $paths = [];

        foreach ($response->json('query.pages', []) as $page) {
            $info = $page['imageinfo'][0] ?? null;
            $mime = $info['mime'] ?? null;
            $url = $info['thumburl'] ?? null;

            if (! $url || ! in_array($mime, ['image/jpeg', 'image/png'], true)) {
                continue;
            }

            try {
                $imageResponse = Http::withHeaders(['User-Agent' => self::USER_AGENT])->timeout(15)->get($url);
            } catch (\Throwable) {
                continue;
            }

            if (! $imageResponse->ok()) {
                continue;
            }

            $path = $cacheDir.'/'.Str::uuid().'.'.($mime === 'image/png' ? 'png' : 'jpg');
            Storage::disk('local')->put($path, $imageResponse->body());
            $paths[] = $path;
        }

        return $paths;
    }

    /**
     * @param  array<int, string>  $primary
     * @param  array<int, string>  $fallback
     * @return array<int, string>
     */
    private function pickImages(array $primary, array $fallback, int $count): array
    {
        $combined = array_values(array_unique([...$primary, ...$fallback]));

        if ($combined === []) {
            return [];
        }

        shuffle($combined);

        return array_slice($combined, 0, min($count, count($combined)));
    }
}
