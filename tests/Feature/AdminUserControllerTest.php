<?php

namespace Tests\Feature;

use App\Models\Lpa;
use App\Models\Payment;
use App\Models\User;
use App\Models\Will;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_users_index(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(5)->create();

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Users/Index')
            ->has('users.data', 6)
        );
    }

    public function test_non_admin_cannot_view_users_index(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($user)->get(route('admin.users.index'));

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_guest_cannot_view_users_index(): void
    {
        $response = $this->get(route('admin.users.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_view_create_user_page(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get(route('admin.users.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Users/Create')
        );
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'is_admin' => false,
        ];

        $response = $this->actingAs($admin)->post(route('admin.users.store'), $userData);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success', 'User created successfully.');

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'is_admin' => false,
        ]);

        $user = User::where('email', 'test@example.com')->first();
        $this->assertTrue(\Hash::check('Password123!', $user->password));
    }

    public function test_admin_can_create_admin_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $userData = [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'is_admin' => true,
        ];

        $response = $this->actingAs($admin)->post(route('admin.users.store'), $userData);

        $response->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseHas('users', [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);
    }

    public function test_create_user_validates_required_fields(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post(route('admin.users.store'), []);

        $response->assertSessionHasErrors(['name', 'email', 'password']);
    }

    public function test_create_user_validates_unique_email(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $existingUser = User::factory()->create(['email' => 'existing@example.com']);

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'Test User',
            'email' => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_create_user_validates_password_confirmation(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'DifferentPassword123!',
        ]);

        $response->assertSessionHasErrors(['password']);
    }

    public function test_admin_can_view_edit_user_page(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create(['name' => 'Edit Me']);

        $response = $this->actingAs($admin)->get(route('admin.users.edit', $user));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Users/Edit')
            ->has('user', fn ($user) => $user
                ->where('name', 'Edit Me')
                ->etc()
            )
        );
    }

    public function test_admin_can_update_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
            'is_admin' => false,
        ]);

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'is_admin' => true,
        ]);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success', 'User updated successfully.');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'email' => 'new@example.com',
            'is_admin' => true,
        ]);
    }

    public function test_admin_can_update_user_password(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'name' => $user->name,
            'email' => $user->email,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertRedirect(route('admin.users.index'));

        $user->refresh();
        $this->assertTrue(\Hash::check('NewPassword123!', $user->password));
    }

    public function test_admin_can_update_user_without_changing_password(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create(['password' => \Hash::make('OriginalPassword123!')]);
        $originalPassword = $user->password;

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'name' => 'Updated Name',
            'email' => $user->email,
            'password' => '',
            'password_confirmation' => '',
        ]);

        $response->assertRedirect(route('admin.users.index'));

        $user->refresh();
        $this->assertEquals($originalPassword, $user->password);
    }

    public function test_update_user_validates_unique_email_except_current(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user1 = User::factory()->create(['email' => 'user1@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user1), [
            'name' => $user1->name,
            'email' => 'user2@example.com',
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $user));

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success', 'User deleted successfully.');

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $admin));

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('error', 'You cannot delete your own account.');

        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
        ]);
    }

    public function test_non_admin_cannot_create_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($user)->post(route('admin.users.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_non_admin_cannot_update_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $targetUser = User::factory()->create();

        $response = $this->actingAs($user)->put(route('admin.users.update', $targetUser), [
            'name' => 'New Name',
            'email' => $targetUser->email,
        ]);

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_non_admin_cannot_delete_user(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $targetUser = User::factory()->create();

        $response = $this->actingAs($user)->delete(route('admin.users.destroy', $targetUser));

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_users_index_can_filter_by_admin_role(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(3)->create(['is_admin' => true]);
        User::factory()->count(5)->create(['is_admin' => false]);

        $response = $this->actingAs($admin)->get(route('admin.users.index', ['role' => 'admin']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Users/Index')
            ->where('currentFilter', 'admin')
            ->has('users.data', 4)
        );
    }

    public function test_users_index_can_filter_by_user_role(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(3)->create(['is_admin' => true]);
        User::factory()->count(5)->create(['is_admin' => false]);

        $response = $this->actingAs($admin)->get(route('admin.users.index', ['role' => 'user']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Users/Index')
            ->where('currentFilter', 'user')
            ->has('users.data', 5)
        );
    }

    public function test_users_index_pagination_works(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(20)->create();

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Users/Index')
            ->has('users.data', 15)
            ->has('users.links')
        );
    }

    public function test_users_index_includes_activity_counts(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
            'created_at' => now()->subDay(),
        ]);
        $target = User::factory()->create(['created_at' => now()]);
        Payment::factory()->count(2)->create(['user_id' => $target->id]);
        Will::create([
            'user_id' => $target->id,
            'will_type' => 'Me',
            'status' => 'draft',
        ]);
        Lpa::create([
            'user_id' => $target->id,
            'who_for' => 'Me',
            'document_type' => 'property',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Users/Index')
            ->where('users.data.0.id', $target->id)
            ->where('users.data.0.payments_count', 2)
            ->where('users.data.0.wills_count', 1)
            ->where('users.data.0.lpas_count', 1)
        );
    }

    public function test_admin_can_view_user_details(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $target = User::factory()->create();
        Payment::factory()->create([
            'user_id' => $target->id,
            'metadata' => ['product' => 'single_will'],
        ]);

        $response = $this->actingAs($admin)->get(route('admin.users.details', $target));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Users/Details')
            ->where('user.id', $target->id)
            ->where('activity.payments_count', 1)
            ->where('activity.payments_succeeded_count', 1)
            ->has('payments', 1)
            ->has('wills', 0)
            ->has('lpas', 0)
        );
    }

    public function test_non_admin_cannot_view_user_details(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $target = User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.users.details', $target));

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_admin_can_download_will_pdf_for_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $owner = User::factory()->create();
        $will = Will::create([
            'user_id' => $owner->id,
            'will_type' => 'Me',
            'status' => 'draft',
            'personal_info' => [
                'title' => 'Mr',
                'firstName' => 'Test',
                'lastName' => 'User',
            ],
        ]);

        $response = $this->actingAs($admin)->get(route('admin.users.wills.pdf', [
            'user' => $owner,
            'will' => $will,
        ]));

        $response->assertOk();
        $response->assertDownload();
    }

    public function test_admin_can_download_lpa_pdf_for_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $owner = User::factory()->create();
        $lpa = Lpa::create([
            'user_id' => $owner->id,
            'who_for' => 'Me',
            'document_type' => 'property',
            'status' => 'draft',
            'donor_details' => [],
            'contact_details' => [],
            'attorneys' => [['name' => 'Attorney One']],
        ]);

        $response = $this->actingAs($admin)->get(route('admin.users.lpas.pdf', [
            'user' => $owner,
            'lpa' => $lpa,
        ]));

        $response->assertOk();
        $response->assertDownload();
    }

    public function test_admin_cannot_download_will_pdf_when_document_belongs_to_another_user(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $owner = User::factory()->create();
        $otherOwner = User::factory()->create();
        $will = Will::create([
            'user_id' => $otherOwner->id,
            'will_type' => 'Me',
            'status' => 'draft',
            'personal_info' => ['firstName' => 'X'],
        ]);

        $response = $this->actingAs($admin)->get(route('admin.users.wills.pdf', [
            'user' => $owner,
            'will' => $will,
        ]));

        $response->assertNotFound();
    }

    public function test_non_admin_cannot_download_user_will_pdf(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $owner = User::factory()->create();
        $will = Will::create([
            'user_id' => $owner->id,
            'will_type' => 'Me',
            'status' => 'draft',
            'personal_info' => ['firstName' => 'Y'],
        ]);

        $response = $this->actingAs($user)->get(route('admin.users.wills.pdf', [
            'user' => $owner,
            'will' => $will,
        ]));

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }
}
