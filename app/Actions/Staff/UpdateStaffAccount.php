<?php

namespace App\Actions\Staff;

use App\Models\User;

class UpdateStaffAccount
{
    /**
     * @param  array{full_name: string, email: string, phone_number?: string|null, role: string, password?: string|null}  $data
     */
    public function handle(User $staff, array $data): User
    {
        $staff->update([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'] ?? null,
            'role' => $data['role'],
        ]);

        if (! empty($data['password'])) {
            $staff->update(['password' => $data['password']]);
        }

        return $staff;
    }
}
