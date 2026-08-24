<?php

namespace App\Actions\ActivityLog;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class RecordActivity
{
    /**
     * Record one audit-trail entry for a sensitive admin/staff action.
     *
     * @param  array<string, mixed>  $properties
     */
    public function handle(?User $causer, string $action, Model $subject, string $description, array $properties = []): ActivityLog
    {
        return ActivityLog::create([
            'causer_id' => $causer?->id,
            'action' => $action,
            'subject_type' => $subject::class,
            'subject_id' => $subject->getKey(),
            'description' => $description,
            'properties' => $properties,
            'created_at' => now(),
        ]);
    }
}
