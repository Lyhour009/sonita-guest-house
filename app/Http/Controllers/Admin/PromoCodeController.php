<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PromoCodeStoreRequest;
use App\Http\Requests\Admin\PromoCodeUpdateRequest;
use App\Models\PromoCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromoCodeController extends Controller
{
    /**
     * Display the admin promo code listing.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $promoCodes = PromoCode::query()
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where('code', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/promo-codes/index', [
            'promoCodes' => $promoCodes->through(fn (PromoCode $promoCode) => [
                'id' => $promoCode->id,
                'code' => $promoCode->code,
                'discount_type' => $promoCode->discount_type,
                'discount_value' => (float) $promoCode->discount_value,
                'active' => $promoCode->active,
                'expires_at' => $promoCode->expires_at?->toDateString(),
                'max_uses' => $promoCode->max_uses,
                'used_count' => $promoCode->used_count,
            ]),
            'filters' => [
                'search' => $filters['search'] ?? null,
            ],
        ]);
    }

    /**
     * Store a newly created promo code.
     */
    public function store(PromoCodeStoreRequest $request): RedirectResponse
    {
        PromoCode::create([
            ...$request->validated(),
            'code' => strtoupper($request->validated('code')),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.promoCodes.created']);

        return to_route('admin.promo-codes.index');
    }

    /**
     * Update a promo code.
     */
    public function update(PromoCodeUpdateRequest $request, PromoCode $promoCode): RedirectResponse
    {
        $promoCode->update([
            ...$request->validated(),
            'code' => strtoupper($request->validated('code')),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.promoCodes.updated']);

        return to_route('admin.promo-codes.index');
    }

    /**
     * Delete a promo code.
     */
    public function destroy(PromoCode $promoCode): RedirectResponse
    {
        $promoCode->delete();

        Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.promoCodes.deleted']);

        return to_route('admin.promo-codes.index');
    }
}
