<?php

namespace App\Actions\Staff;

use App\Models\User;

class CreateStaffAccount
{
    /**
     * @param  array{full_name: string, email: string, phone_number?: string|null, role: string, password: string}  $data
     */
    public function handle(array $data): User
    {
        $user = User::create([
            'role' => $data['role'],
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'] ?? null,
            'password' => $data['password'],
        ]);

        $user->forceFill(['email_verified_at' => now()])->save();

        return $user;
    }
}
