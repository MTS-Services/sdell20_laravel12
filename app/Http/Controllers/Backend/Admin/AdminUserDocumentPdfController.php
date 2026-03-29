<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lpa;
use App\Models\User;
use App\Models\Will;
use App\Services\LpaPdfService;
use App\Services\WillPdfService;
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
     * Download an LPA PDF for a user (admin only). Draft and final PDFs are allowed.
     */
    public function downloadLpa(User $user, Lpa $lpa): StreamedResponse
    {
        abort_unless($lpa->user_id === $user->id, 404);

        return $this->lpaPdfService->downloadPdf($lpa);
    }
}
