<?php

namespace Tests\Feature\Admin;

use App\Enums\CommonStatusEnum;
use App\Enums\UserTypeEnum;
use App\Models\Administrator;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => str_repeat('a', 64)]);

        Schema::create('users', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->smallInteger('type');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('administrators', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('name');
            $table->string('first_name')->nullable();
            $table->string('email');
            $table->string('password');
            $table->smallInteger('status');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('roles', function (Blueprint $table): void {
            $table->uuid('uuid')->primary();
            $table->string('name');
            $table->string('guard_name');
            $table->timestamps();
            $table->unique(['name', 'guard_name']);
        });

        Schema::create('model_has_roles', function (Blueprint $table): void {
            $table->uuid('role_id');
            $table->string('model_type');
            $table->uuid('model_uuid');
            $table->primary(['role_id', 'model_uuid', 'model_type']);
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('model_has_roles');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('administrators');
        Schema::dropIfExists('users');

        parent::tearDown();
    }

    public function test_administrator_can_login_and_use_the_token_for_profile(): void
    {
        $user = User::create([
            'id' => (string) Str::uuid(),
            'type' => UserTypeEnum::ADMINISTRATOR->value,
        ]);

        $administrator = Administrator::create([
            'user_id' => $user->id,
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'Password123!',
            'status' => CommonStatusEnum::ACTIVE->value,
            'email_verified_at' => now(),
        ]);

        $administrator->assignRole(Role::create([
            'name' => 'Administrator',
            'guard_name' => 'administrators',
        ]));

        $loginResponse = $this->postJson('/api/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'Password123!',
        ]);

        $loginResponse->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.token_type', 'Bearer')
            ->assertJsonPath('data.user.roles.0', 'Administrator');

        $token = $loginResponse->json('data.token');

        $this->withToken($token)
            ->getJson('/api/admin/profile')
            ->assertOk()
            ->assertJsonPath('data.email', 'admin@example.com');
    }
}
