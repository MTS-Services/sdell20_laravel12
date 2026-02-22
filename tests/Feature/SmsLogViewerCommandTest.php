<?php

use function Pest\Laravel\artisan;

beforeEach(function () {
    $this->date = now()->format('Y-m-d');
    $this->logFile = storage_path("logs/clicksend-{$this->date}.log");
    $this->existed = file_exists($this->logFile);
    $this->originalContent = $this->existed ? file_get_contents($this->logFile) : null;
});

afterEach(function () {
    if ($this->existed && $this->originalContent !== null) {
        file_put_contents($this->logFile, $this->originalContent);
    } elseif (! $this->existed && file_exists($this->logFile)) {
        unlink($this->logFile);
    }
});

it('shows log entries from today', function () {
    file_put_contents($this->logFile, "[{$this->date} 10:00:00] testing.INFO: ClickSend SMS outbound {\"to\":\"+447911123456\"}\n");
    file_put_contents($this->logFile, "[{$this->date} 10:00:01] testing.INFO: ClickSend SMS accepted {\"to\":\"+447911123456\"}\n", FILE_APPEND);

    artisan('sms:logs --lines=10')
        ->assertSuccessful()
        ->expectsOutputToContain('SMS Log Viewer');
});

it('shows error when no log files exist', function () {
    // Remove today's log if it exists
    if (file_exists($this->logFile)) {
        unlink($this->logFile);
    }

    // Also temporarily hide all log files by checking a non-existent date
    $allFiles = glob(storage_path('logs/clicksend-*.log'));
    $renamedFiles = [];

    foreach ($allFiles as $file) {
        $tmpName = $file.'.tmp';
        rename($file, $tmpName);
        $renamedFiles[$file] = $tmpName;
    }

    artisan('sms:logs')
        ->assertFailed();

    // Restore renamed files
    foreach ($renamedFiles as $original => $tmp) {
        rename($tmp, $original);
    }
});

it('filters errors only with --errors flag', function () {
    file_put_contents($this->logFile, "[{$this->date} 10:00:00] testing.INFO: ClickSend SMS outbound {\"to\":\"+447911123456\"}\n");
    file_put_contents($this->logFile, "[{$this->date} 10:00:01] testing.ERROR: ClickSend API error {\"status\":500}\n", FILE_APPEND);

    artisan('sms:logs --errors')
        ->assertSuccessful();
});

it('displays summary statistics', function () {
    file_put_contents($this->logFile, "[{$this->date} 10:00:00] testing.INFO: ClickSend SMS outbound {\"to\":\"+447911123456\"}\n");
    file_put_contents($this->logFile, "[{$this->date} 10:00:01] testing.INFO: ClickSend SMS accepted {\"to\":\"+447911123456\"}\n", FILE_APPEND);

    artisan('sms:logs')
        ->assertSuccessful()
        ->expectsOutputToContain('Total log entries')
        ->expectsOutputToContain('Successful sends');
});
