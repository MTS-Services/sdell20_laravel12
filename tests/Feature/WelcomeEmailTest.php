<?php

use App\Events\UserLoggedIn;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;

test("user logged in event is dispatched when user logs in", function () {
    Event::fake();

    $user = User::factory()->create([
        "email" => "test@example.com",
        "password" => bcrypt("password"),
    ]);

    $this->post("/login", [
        "email" => "test@example.com",
        "password" => "password",
    ]);

    Event::assertDispatched(UserLoggedIn::class, function ($event) use ($user) {
        return $event->user->id === $user->id;
    });
});

test("welcome email contains correct user information", function () {
    $user = User::factory()->create([
        "name" => "John Doe",
        "email" => "john@example.com",
    ]);

    $mailable = new WelcomeEmail($user);

    $mailable->assertSeeInHtml("John Doe");
    $mailable->assertSeeInHtml("john@example.com");
    $mailable->assertSeeInHtml("Welcome to ".config("app.name"));
});

test("welcome email has correct subject", function () {
    $user = User::factory()->create();

    $mailable = new WelcomeEmail($user);

    expect($mailable->envelope()->subject)->toBe("Welcome to ".config("app.name"));
});

test("welcome email uses correct view", function () {
    $user = User::factory()->create();

    $mailable = new WelcomeEmail($user);

    expect($mailable->content()->view)->toBe("emails.welcome");
});

test("welcome email is queued when user registers", function () {
    Mail::fake();

    $user = User::factory()->create();

    event(new Registered($user));

    Mail::assertQueued(WelcomeEmail::class);
});

test("welcome email is queued upon http registration", function () {
    Mail::fake();

    $this->post("/register", [
        "name" => "Test New User",
        "email" => "new_user@example.com",
        "password" => "StrongPassword123!",
        "password_confirmation" => "StrongPassword123!",
        "terms" => true
    ]);

    Mail::assertQueued(WelcomeEmail::class, function ($mail) {
        return $mail->user->email === "new_user@example.com";
    });
});

