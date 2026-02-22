<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SmsLogViewerCommand extends Command
{
    protected $signature = 'sms:logs {--lines=50 : Number of recent log lines to show} {--errors : Show only errors and warnings}';

    protected $description = 'View recent ClickSend SMS log entries to verify SMS delivery';

    public function handle(): int
    {
        $logPath = storage_path('logs');
        $today = now()->format('Y-m-d');
        $logFile = "{$logPath}/clicksend-{$today}.log";

        if (! file_exists($logFile)) {
            $this->warn("No SMS log file found for today ({$today}).");
            $this->info('Log file path: '.$logFile);

            // Try to find the most recent one
            $files = glob("{$logPath}/clicksend-*.log");
            if (! empty($files)) {
                $logFile = end($files);
                $this->info('Showing most recent log: '.basename($logFile));
            } else {
                $this->error('No ClickSend log files found. Send an SMS first.');

                return self::FAILURE;
            }
        }

        $lines = (int) $this->option('lines');
        $errorsOnly = (bool) $this->option('errors');

        $this->newLine();
        $this->components->info('SMS Log Viewer — '.basename($logFile));
        $this->newLine();

        $allLines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        if (empty($allLines)) {
            $this->warn('Log file is empty.');

            return self::SUCCESS;
        }

        if ($errorsOnly) {
            $allLines = array_filter($allLines, function (string $line): bool {
                return str_contains($line, '.ERROR:')
                    || str_contains($line, '.WARNING:')
                    || str_contains($line, 'failed')
                    || str_contains($line, 'error');
            });
            $allLines = array_values($allLines);
        }

        $recentLines = array_slice($allLines, -$lines);

        foreach ($recentLines as $line) {
            if (str_contains($line, '.ERROR:')) {
                $this->error($line);
            } elseif (str_contains($line, '.WARNING:')) {
                $this->warn($line);
            } elseif (str_contains($line, 'accepted') || str_contains($line, 'completed')) {
                $this->info($line);
            } else {
                $this->line($line);
            }
        }

        $this->newLine();

        // Summary
        $totalLines = count($allLines);
        $successCount = count(array_filter($allLines, fn ($l) => str_contains($l, 'SMS accepted')));
        $errorCount = count(array_filter($allLines, fn ($l) => str_contains($l, '.ERROR:') || str_contains($l, '.WARNING:')));

        $this->components->twoColumnDetail('Total log entries', (string) $totalLines);
        $this->components->twoColumnDetail('Successful sends', "<fg=green>{$successCount}</>");
        $this->components->twoColumnDetail('Errors/warnings', $errorCount > 0 ? "<fg=red>{$errorCount}</>" : '0');

        return self::SUCCESS;
    }
}
