<?php

namespace App\Services;

use App\Models\Lpa;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;

class LpaPdfService
{
    public function generatePdf(Lpa $lpa): string
    {
        $pdfContent = $this->renderPdfContent($lpa);

        $filename = $this->generateFilename($lpa);

        Storage::disk('local')->put($filename, $pdfContent);

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
        $stream = Storage::disk('local')->readStream($lpa->pdf_path);

        return response()->streamDownload(function () use ($stream): void {
            if (is_resource($stream)) {
                fpassthru($stream);
                fclose($stream);
            }
        }, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function streamPdf(Lpa $lpa): \Symfony\Component\HttpFoundation\Response
    {
        if (! $lpa->hasPdf()) {
            $this->generatePdf($lpa);
        }

        return response()->file(Storage::disk('local')->path($lpa->pdf_path));
    }

    private function renderPdfContent(Lpa $lpa): string
    {
        $templates = $this->templatesFor($lpa);

        if (count($templates) === 1) {
            $html = View::make($templates[0], [
                'lpa' => $lpa,
                'isDraft' => $lpa->isDraft(),
            ])->render();
        } else {
            // For 'both' type, render both templates and combine
            $htmlParts = [];
            foreach ($templates as $template) {
                $htmlParts[] = View::make($template, [
                    'lpa' => $lpa,
                    'isDraft' => $lpa->isDraft(),
                ])->render();
            }

            // Combine documents with page break
            $html = $this->combineHtmlDocuments($htmlParts);
        }

        return Pdf::loadHTML($html)
            ->setPaper('A4')
            ->setOption('margin-top', 6)
            ->setOption('margin-right', 6)
            ->setOption('margin-bottom', 6)
            ->setOption('margin-left', 6)
            ->output();
    }

    /**
     * Combine multiple HTML documents with page breaks.
     *
     * @param  array<int, string>  $htmlParts
     */
    private function combineHtmlDocuments(array $htmlParts): string
    {
        $combinedHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';

        foreach ($htmlParts as $index => $html) {
            // Extract only the body content from each template
            if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $html, $matches)) {
                $bodyContent = $matches[1];
            } else {
                $bodyContent = $html;
            }

            $combinedHtml .= $bodyContent;

            // Add page break between documents (but not after the last one)
            if ($index < count($htmlParts) - 1) {
                $combinedHtml .= '<div style="page-break-after: always;"></div>';
            }
        }

        $combinedHtml .= '</body></html>';

        return $combinedHtml;
    }

    /**
     * @return array<int, string>
     */
    private function templatesFor(Lpa $lpa): array
    {
        if ($lpa->isBoth()) {
            return ['pdfs.lpa-health-welfare', 'pdfs.lpa-property-finance'];
        }

        return $lpa->isPropertyAndFinance()
            ? ['pdfs.lpa-property-finance']
            : ['pdfs.lpa-health-welfare'];
    }

    private function generateFilename(Lpa $lpa): string
    {
        $type = $lpa->isBoth()
            ? 'both'
            : ($lpa->isPropertyAndFinance() ? 'property-finance' : 'health-welfare');
        $timestamp = now()->format('Y-m-d_His');

        return "lpas/{$lpa->user_id}/lpa-{$type}-{$lpa->id}-{$timestamp}.pdf";
    }

    private function getDownloadFilename(Lpa $lpa): string
    {
        $type = $lpa->isBoth()
            ? 'Health-and-Welfare-Property-and-Financial-Affairs'
            : ($lpa->isPropertyAndFinance()
                ? 'Property-and-Financial-Affairs'
                : 'Health-and-Welfare');

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
