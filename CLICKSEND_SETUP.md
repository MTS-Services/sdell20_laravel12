# ClickSend SMS Integration Configuration

## Environment Variables

Add these to your `.env` file:

```ini
# ClickSend SMS Credentials
CLICKSEND_USERNAME=your@email.com
CLICKSEND_API_KEY=your_clicksend_api_key_here
CLICKSEND_SENDER_ID=MyApp
CLICKSEND_WEBHOOK_SECRET=your_random_webhook_secret_here

# Queue Configuration (for SMS job processing)
QUEUE_CONNECTION=redis
# Or use 'database' if Redis is not available (slower but simpler):
# QUEUE_CONNECTION=database

# Timezone (for scheduling SMS in local time)
APP_TIMEZONE=UTC
```

## Step-by-Step Setup

### 1. Environment Configuration

Get your ClickSend credentials:
- Go to [dashboard.clicksend.com](https://dashboard.clicksend.com)
- Navigate to **Account** → **API Credentials**
- Copy your login email (username) and API key

In your `.env`:
```ini
CLICKSEND_USERNAME=your-login-email@example.com
CLICKSEND_API_KEY=your-api-key-here
CLICKSEND_SENDER_ID=YourAppName
CLICKSEND_WEBHOOK_SECRET=generate-a-random-string-here
```

### 2. Database Setup

Run the migration to create the `scheduled_sms` table:

```bash
php artisan migrate
```

### 3. Queue Configuration

Choose your queue driver:

**Option A: Redis (Recommended)**
```ini
QUEUE_CONNECTION=redis
```

**Option B: Database**
```ini
QUEUE_CONNECTION=database
php artisan queue:table
php artisan migrate
```

### 4. Local Development

In one terminal, start the queue worker:
```bash
php artisan queue:work --queue=sms,default
```

In another terminal, start the scheduler:
```bash
php artisan schedule:work
```

### 5. Production Setup

**With Supervisor:**
```bash
# Edit /etc/supervisor/conf.d/laravel-sms-worker.conf
# Use the configuration from the AGENTS.md guide
supervisorctl reread
supervisorctl update
supervisorctl start laravel-sms-worker:*
```

**Cron Entry:**
```bash
crontab -e
# Add the line:
* * * * * cd /var/www/your-app && php artisan schedule:run >> /dev/null 2>&1
```

### 6. Configure ClickSend Delivery Receipts

In the ClickSend Dashboard:
1. Go to **SMS** → **Settings**
2. Enable **Delivery Receipts**
3. Set the callback URL to:
   ```
   https://yourdomain.com/api/webhooks/clicksend/delivery?secret=YOUR_WEBHOOK_SECRET
   ```

### 7. Test the Integration

**Via Artisan Tinker:**
```php
php artisan tinker

$svc = app(\App\Services\ClickSendSmsService::class);
$svc->send('+8801712345678', 'Test SMS from Laravel');

// Create a scheduled SMS due in 2 minutes
\App\Models\ScheduledSms::create([
    'user_id'       => 1,
    'to_phone'      => '+8801712345678',
    'message'       => 'Scheduled test',
    'scheduled_at'  => now()->addMinutes(2),
    'timezone'      => 'Asia/Dhaka',
]);

// Dispatch due messages manually
\Illuminate\Support\Facades\Artisan::call('sms:dispatch-due');
```

**Via UI:**
1. Login to your application
2. Navigate to `/sms/create`
3. Schedule a test SMS
4. Run `php artisan queue:work` and `php artisan schedule:work` locally
5. Check job processing in the queue

### 8. Run Tests

```bash
# All SMS-related tests
php artisan test --filter=Sms

# Specific test file
php artisan test tests/Feature/ScheduledSmsControllerTest.php

# With coverage
php artisan test --coverage
```

## Phone Number Format

All phone numbers must be in E.164 format:
- **Bangladesh**: `+8801XXXXXXXXX` (11-13 digits)
- **USA**: `+1XXXXXXXXXX`
- **India**: `+91XXXXXXXXXX`

Examples:
- ✅ `+8801712345678`
- ❌ `01712345678` (missing country code)
- ❌ `880-17-12345678` (hyphens not allowed)

## Message Length & Segmentation

**GSM-7 Encoding** (standard ASCII):
- Single SMS: 160 characters
- Multi-part: 153 characters per segment (7 chars overhead for header)

**Unicode Encoding** (Bengali, emoji, etc.):
- Single SMS: 70 characters
- Multi-part: 67 characters per segment

If your message contains Bengali script, each character is Unicode, so plan accordingly.

## Troubleshooting

**401 Unauthorized Error:**
```
Double-check your CLICKSEND_USERNAME and CLICKSEND_API_KEY in .env
Test with curl:
curl -u your@email.com:api_key https://rest.clicksend.com/v3/account
```

**Messages Not Sending:**
1. Check `php artisan queue:work` is running
2. Check `php artisan schedule:work` or cron is running
3. Check logs: `tail -f storage/logs/clicksend.log`
4. Check failed jobs: `App\Models\FailedJob::all()`

**Wrong Timezone:**
Verify `APP_TIMEZONE` in `.env`. SMS are scheduled in UTC in the database but displayed in Asia/Dhaka in the UI.

**Sender ID Not Approved:**
Check ClickSend dashboard under **SMS** → **Sender IDs** for approval status. Fall back to a virtual number if alphanumeric ID is blocked in your region.

## API Routes

- `POST /api/webhooks/clicksend/delivery` - ClickSend delivery receipt webhook
- All other SMS routes are protected by authentication middleware

## Security Notes

- Never commit `.env` to version control
- Rotate your API key if exposed
- Use the webhook secret to prevent unauthorized receipt updates
- Rate-limited to 20 SMS creations per minute per user
- All SMS operations are user-scoped (users can only view/manage their own)
