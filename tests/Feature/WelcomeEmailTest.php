<?php

use App\Events\UserLoggedIn;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;

test('user logged in event is dispatched when user logs in', function () {
    Event::fake();

    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    Event::assertDispatched(UserLoggedIn::class, function ($event) use ($user) {
        return $event->user->id === $user->id;
    });
});

test('welcome email is sent when user logs in', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    Mail::assertQueued(WelcomeEmail::class, function ($mail) use ($user) {
        return $mail->user->id === $user->id;
    });
});

test('welcome email contains correct user information', function () {
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $mailable = new WelcomeEmail($user);

    $mailable->assertSeeInHtml('John Doe');
    $mailable->assertSeeInHtml('john@example.com');
    $mailable->assertSeeInHtml('Welcome to '.config('app.name'));
});

test('welcome email has correct subject', function () {
    $user = User::factory()->create();

    $mailable = new WelcomeEmail($user);

    expect($mailable->envelope()->subject)->toBe('Welcome to '.config('app.name'));
});

test('welcome email uses correct view', function () {
    $user = User::factory()->create();

    $mailable = new WelcomeEmail($user);

    expect($mailable->content()->view)->toBe('emails.welcome');
});

test('welcome email is queued for async processing', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    Mail::assertQueued(WelcomeEmail::class);
    Mail::assertNotSent(WelcomeEmail::class);
});
