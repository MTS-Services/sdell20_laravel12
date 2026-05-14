<?php

namespace App\Support;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification as NotificationFacade;
use Illuminate\Support\Str;
use Throwable;

final class MailChannelOnlyNotification extends Notification
{
    public function __construct(private readonly Notification $inner) {}

    public function wrappedNotification(): Notification
    {
        return $this->inner;
    }

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): mixed
    {
        return $this->inner->toMail($notifiable);
    }
}

class OperationsSlack
{
    public static function isConfigured(): bool
    {
        return self::defaultWebhookUrl() !== null
            || (filled(config('services.slack.notifications.bot_user_oauth_token'))
                && filled(config('services.slack.notifications.channel')));
    }

    /**
     * Send a Slack notification, optionally routed to a per-action channel.
     *
     * When {@see $channelKey} is set (contact, lpa, will, payment), the message is sent only to
     * the route from {@see SLACK_CHANNEL_*} for that key. If that env is blank, the app uses the bot
     * default channel first, then the global webhook (so a single webhook is not used for every
     * action by default). When {@see $channelKey} is null, the legacy order is webhook then bot channel.
     *
     * Mail mirror (when configured) is sent first via {@see MailChannelOnlyNotification} so it is
     * not lost if Slack fails. There is no cross-channel fallback: if a dedicated channel rejects the
     * post (e.g. bot not invited), fix Slack membership so each alert stays in its own channel.
     */
    public static function notify(Notification $notification, ?string $channelKey = null): void
    {
        if (! self::isConfigured()) {
            return;
        }

        $route = self::routeFor($channelKey);

        if ($route === null) {
            return;
        }

        $mirrorEmail = self::mirrorEmail();
        if ($mirrorEmail !== null && in_array('mail', $notification->via(new \stdClass), true)) {
            try {
                NotificationFacade::route('mail', $mirrorEmail)
                    ->notify(new MailChannelOnlyNotification($notification));
            } catch (Throwable $e) {
                Log::warning('operations_slack_mirror_mail_failed', [
                    'message' => $e->getMessage(),
                    'notification' => $notification::class,
                ]);
            }
        }

        try {
            NotificationFacade::route('slack', $route)->notify($notification);
        } catch (Throwable $e) {
            $message = Str::lower($e->getMessage());
            Log::warning('operations_slack_failed', [
                'message' => $e->getMessage(),
                'notification' => $notification::class,
                'channel_key' => $channelKey,
                'route' => self::redactSlackRoute($route),
                'hint' => match (true) {
                    Str::contains($message, 'not_in_channel') => 'Invite the Slack app to this channel (e.g. /invite @WillWriteBot) or add the chat:write.public bot scope so it can post to public channels without joining.',
                    Str::contains($message, 'channel_not_found') => 'Check SLACK_CHANNEL_* matches the channel id from Slack (open channel → copy link → id after last /). Wrong workspace or typo returns channel_not_found.',
                    default => null,
                },
            ]);
        }
    }

    public static function mirrorEmail(): ?string
    {
        $email = config('services.slack.notifications.mirror_email');

        if (! is_string($email)) {
            return null;
        }

        $email = trim($email);

        return $email !== '' ? $email : null;
    }

    private static function redactSlackRoute(string $route): string
    {
        if (Str::startsWith($route, ['https://hooks.slack.com/'])) {
            return 'webhook:…' . Str::substr($route, -8);
        }

        return $route;
    }

    /**
     * Resolve the Slack route (webhook URL or channel identifier) for the given action key.
     *
     * When {@see $channelKey} is set and the matching SLACK_CHANNEL_* value is non-empty, that route
     * is used exclusively (separate channel per action).
     *
     * When the key is set but that env is blank, the global incoming webhook is not preferred first
     * (one webhook would merge every action into a single channel). Instead we use the bot default
     * channel when available, then the webhook.
     *
     * When {@see $channelKey} is null (e.g. mail-delivery alerts), the legacy order applies: webhook first,
     * then bot default channel.
     */
    private static function routeFor(?string $channelKey): ?string
    {
        if ($channelKey !== null) {
            $specific = self::channelForKey($channelKey);
            if ($specific !== null) {
                return $specific;
            }

            return self::normalizedBotChannel() ?? self::defaultWebhookUrl();
        }

        return self::defaultWebhookUrl() ?? self::normalizedBotChannel();
    }

    private static function channelForKey(string $channelKey): ?string
    {
        $value = config('services.slack.notifications.channels.' . $channelKey);

        if (! is_string($value)) {
            return null;
        }

        $value = trim($value);

        if ($value === '') {
            return null;
        }

        if (Str::startsWith($value, ['https://hooks.slack.com/'])) {
            return $value;
        }

        return self::normalizeChannel($value);
    }

    private static function defaultWebhookUrl(): ?string
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

        return self::normalizeChannel($channel);
    }

    private static function normalizeChannel(string $channel): ?string
    {
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

        return '#' . $channel;
    }
}
