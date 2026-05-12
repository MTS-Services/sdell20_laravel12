<?php

namespace App\Support;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification as NotificationFacade;
use Illuminate\Support\Str;
use Throwable;

class OperationsSlack
{
    public static function isConfigured(): bool
    {
        return self::webhookUrl() !== null
            || (filled(config('services.slack.notifications.bot_user_oauth_token'))
                && filled(config('services.slack.notifications.channel')));
    }

    public static function notify(Notification $notification): void
    {
        if (! self::isConfigured()) {
            return;
        }

        $route = self::webhookUrl() ?? self::normalizedBotChannel();

        if ($route === null) {
            return;
        }

        try {
            NotificationFacade::route('slack', $route)->notify($notification);
        } catch (Throwable $e) {
            Log::warning('operations_slack_failed', [
                'message' => $e->getMessage(),
                'notification' => $notification::class,
            ]);
        }
    }

    private static function webhookUrl(): ?string
    {
        $url = config('services.slack.notifications.webhook_url');

        return is_string($url) && Str::startsWith($url, ['https://']) ? $url : null;
    }

    private static function normalizedBotChannel(): ?string
    {
        if (! filled(config('services.slack.notifications.bot_user_oauth_token'))) {
            return null;
        }

        $channel = config('services.slack.notifications.channel');

        if (! is_string($channel)) {
            return null;
        }

        $channel = trim($channel);

        if ($channel === '') {
            return null;
        }

        if (Str::startsWith($channel, '#')) {
            return $channel;
        }

        if (preg_match('/^[CGD][A-Z0-9]{8,}$/i', $channel) === 1) {
            return $channel;
        }

        return '#'.$channel;
    }
}
