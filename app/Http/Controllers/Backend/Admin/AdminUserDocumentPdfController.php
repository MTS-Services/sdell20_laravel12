<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lpa;
use App\Models\User;
use App\Models\Will;
use App\Services\LpaPdfService;
use App\Services\WillPdfService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminUserDocumentPdfController extends Controller
{
    public function __construct(
        private readonly WillPdfService $willPdfService,
        private readonly LpaPdfService $lpaPdfService,
    ) {}

    /**
     * Download a will PDF for a user (admin only). Draft and final PDFs are allowed.
     */
    public function downloadWill(User $user, Will $will): StreamedResponse
    {
        abort_unless($will->user_id === $user->id, 404);

        return $this->willPdfService->downloadPdf($will);
    }

    /**
     * Stream a will PDF in the browser for admin preview (draft or final).
     */
    public function previewWill(User $user, Will $will): Response
    {
        abort_unless($will->user_id === $user->id, 404);

        return $this->willPdfService->streamPdf($will);
    }

    /**
     * Download an LPA PDF for a user (admin only). Draft and final PDFs are allowed.
     */
    public function downloadLpa(User $user, Lpa $lpa): StreamedResponse
    {
        abort_unless($lpa->user_id === $user->id, 404);

        return $this->lpaPdfService->downloadPdf($lpa);
    }

    /**
     * Stream an LPA PDF in the browser for admin preview (draft or final).
     */
    public function previewLpa(User $user, Lpa $lpa): Response
    {
        abort_unless($lpa->user_id === $user->id, 404);

        return $this->lpaPdfService->streamPdf($lpa);
    }
}
