<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('sms:dispatch-due')->everyMinute()->withoutOverlapping();

Schedule::command('campaigns:dispatch-due')->everyMinute()->withoutOverlapping();
