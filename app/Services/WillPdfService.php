<?php

namespace App\Services;

use App\Models\Will;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;

class WillPdfService
{
    private Dompdf $dompdf;

    public function __construct()
    {
        $options = new Options;
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Arial');

        $this->dompdf = new Dompdf($options);
    }

    public function generatePdf(Will $will): string
    {
        // Generate HTML from template
        $html = View::make('pdfs.will', [
            'will' => $will,
            'isDraft' => $will->isDraft(),
        ])->render();

        // Load HTML into Dompdf
        $this->dompdf->loadHtml($html);

        // Set paper size (A4)
        $this->dompdf->setPaper('A4', 'portrait');

        // Render PDF
        $this->dompdf->render();

        // Generate filename
        $filename = $this->generateFilename($will);

        // Save PDF to storage
        $pdfContent = $this->dompdf->output();
        Storage::disk('local')->put($filename, $pdfContent);

        // Update Will record
        $will->update([
            'pdf_path' => $filename,
            'pdf_generated_at' => now(),
        ]);

        return $filename;
    }

    public function regeneratePdf(Will $will): string
    {
        // Delete old PDF if exists
        if ($will->hasPdf()) {
            Storage::disk('local')->delete($will->pdf_path);
        }

        return $this->generatePdf($will);
    }

    public function downloadPdf(Will $will): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        if (! $will->hasPdf()) {
            $this->generatePdf($will);
        }

        $filename = $this->getDownloadFilename($will);

        return Storage::disk('local')->download($will->pdf_path, $filename);
    }

    public function streamPdf(Will $will): \Symfony\Component\HttpFoundation\Response
    {
        if (! $will->hasPdf()) {
            $this->generatePdf($will);
        }

        return response()->file(Storage::disk('local')->path($will->pdf_path));
    }

    private function generateFilename(Will $will): string
    {
        $type = $will->isSingleWill() ? 'single' : 'mirror';
        $timestamp = now()->format('Y-m-d_His');

        return "wills/{$will->user_id}/will-{$type}-{$will->id}-{$timestamp}.pdf";
    }

    private function getDownloadFilename(Will $will): string
    {
        $type = $will->isSingleWill() ? 'Single' : 'Mirror';
        $status = $will->isDraft() ? 'DRAFT-' : '';

        return "Will-{$status}{$type}-{$will->id}.pdf";
    }

    public function addDraftWatermark(Will $will): void
    {
        if ($will->isDraft() && $will->hasPdf()) {
            // Regenerate PDF with draft watermark
            $this->regeneratePdf($will);
        }
    }

    public function removeDraftWatermark(Will $will): void
    {
        if (! $will->isDraft() && $will->hasPdf()) {
            // Regenerate PDF without draft watermark
            $this->regeneratePdf($will);
        }
    }
}
