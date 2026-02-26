<?php

namespace App\Services;

use App\Models\Lpa;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;

class LpaPdfService
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

    public function generatePdf(Lpa $lpa): string
    {
        // Select template based on document type
        $template = $lpa->isPropertyAndFinance()
            ? 'pdfs.lpa-property-finance'
            : 'pdfs.lpa-health-welfare';

        // Generate HTML from template
        $html = View::make($template, [
            'lpa' => $lpa,
            'isDraft' => $lpa->isDraft(),
        ])->render();

        // Load HTML into Dompdf
        $this->dompdf->loadHtml($html);

        // Set paper size (A4)
        $this->dompdf->setPaper('A4', 'portrait');

        // Render PDF
        $this->dompdf->render();

        // Generate filename
        $filename = $this->generateFilename($lpa);

        // Save PDF to storage
        $pdfContent = $this->dompdf->output();
        Storage::disk('local')->put($filename, $pdfContent);

        // Update LPA record
        $lpa->update([
            'pdf_path' => $filename,
            'pdf_generated_at' => now(),
        ]);

        return $filename;
    }

    public function regeneratePdf(Lpa $lpa): string
    {
        // Delete old PDF if exists
        if ($lpa->hasPdf()) {
            Storage::disk('local')->delete($lpa->pdf_path);
        }

        return $this->generatePdf($lpa);
    }

    public function downloadPdf(Lpa $lpa): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        if (! $lpa->hasPdf()) {
            $this->generatePdf($lpa);
        }

        $filename = $this->getDownloadFilename($lpa);

        return Storage::disk('local')->download($lpa->pdf_path, $filename);
    }

    public function streamPdf(Lpa $lpa): \Symfony\Component\HttpFoundation\Response
    {
        if (! $lpa->hasPdf()) {
            $this->generatePdf($lpa);
        }

        return response()->file(Storage::disk('local')->path($lpa->pdf_path));
    }

    private function generateFilename(Lpa $lpa): string
    {
        $type = $lpa->isPropertyAndFinance() ? 'property-finance' : 'health-welfare';
        $timestamp = now()->format('Y-m-d_His');

        return "lpas/{$lpa->user_id}/lpa-{$type}-{$lpa->id}-{$timestamp}.pdf";
    }

    private function getDownloadFilename(Lpa $lpa): string
    {
        $type = $lpa->isPropertyAndFinance()
            ? 'Property-and-Financial-Affairs'
            : 'Health-and-Welfare';

        $status = $lpa->isDraft() ? 'DRAFT-' : '';

        return "LPA-{$status}{$type}-{$lpa->id}.pdf";
    }

    public function addDraftWatermark(Lpa $lpa): void
    {
        if ($lpa->isDraft() && $lpa->hasPdf()) {
            // Regenerate PDF with draft watermark
            $this->regeneratePdf($lpa);
        }
    }

    public function removeDraftWatermark(Lpa $lpa): void
    {
        if (! $lpa->isDraft() && $lpa->hasPdf()) {
            // Regenerate PDF without draft watermark
            $this->regeneratePdf($lpa);
        }
    }
}
