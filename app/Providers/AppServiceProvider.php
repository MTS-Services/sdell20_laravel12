<?php

namespace App\Providers;

use App\Listeners\SendMailDeliveryConfirmationToSlack;
use App\Models\Blog;
use App\Models\BlogCategory;
use App\Observers\BlogCategoryObserver;
use App\Observers\BlogObserver;
use App\Services\Payment\PaymentIntentClientInterface;
use App\Services\Payment\StripePaymentIntentClient;
use App\Services\TwilioService;
use Carbon\CarbonImmutable;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PaymentIntentClientInterface::class, function () {
            return new StripePaymentIntentClient(config('services.stripe.secret'));
        });

        $this->app->singleton(TwilioService::class, function () {
            return new TwilioService;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Blog::observe(BlogObserver::class);
        BlogCategory::observe(BlogCategoryObserver::class);

        Event::listen(MessageSent::class, SendMailDeliveryConfirmationToSlack::class);
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
                ? Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised()
                : null
        );
    }
}
