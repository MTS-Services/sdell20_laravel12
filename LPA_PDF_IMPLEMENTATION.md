# LPA PDF Generation System - Implementation Guide

## Overview
A comprehensive system for generating official LPA (Lasting Power of Attorney) PDF documents with automatic draft status management and payment integration.

## Features Implemented

### 1. Database Structure
- **Migration**: `2026_02_26_085233_create_lpas_table.php`
- **Fields**:
  - User relationship and basic LPA information
  - Donor details and contact information (JSON)
  - Attorneys and replacement attorneys (JSON)
  - Decision tracking (life-sustaining treatment, notifications)
  - PDF generation tracking (path, timestamp, draft status)
  - Payment tracking (amount, payment reference, paid_at)

### 2. Models & Relationships
- **Lpa Model** (`app/Models/Lpa.php`)
  - Belongs to User
  - JSON casting for complex data
  - Helper methods: `isPropertyAndFinance()`, `isHealthAndWelfare()`, `isDraft()`, `isPaid()`, `hasPdf()`
  - `markAsPaid()` method for payment completion

### 3. PDF Generation Service
- **LpaPdfService** (`app/Services/LpaPdfService.php`)
  - Uses Dompdf library for PDF generation
  - Template selection based on document type
  - Automatic draft watermark management
  - Methods:
    - `generatePdf()` - Creates PDF from template
    - `regeneratePdf()` - Regenerates existing PDF
    - `downloadPdf()` - Downloads PDF with proper filename
    - `streamPdf()` - Streams PDF for preview
    - `removeDraftWatermark()` - Removes draft status after payment

### 4. PDF Templates
Two official templates matching government standards:

#### Property & Finance Template
- **File**: `resources/views/pdfs/lpa-property-finance.blade.php`
- **Features**:
  - Office of the Public Guardian header
  - Crown logo and helpline information
  - Barcode placeholder
  - Section 1: Donor information
  - Address fields with proper formatting
  - OPG office use section
  - Draft watermark (conditional)

#### Health & Welfare Template
- **File**: `resources/views/pdfs/lpa-health-welfare.blade.php`
- **Features**:
  - Same header structure as Property & Finance
  - Life-sustaining treatment section (highlighted)
  - Option A/B selection display
  - All donor and contact information
  - Draft watermark (conditional)

### 5. Controller & Routes
- **LpaController** (`app/Http/Controllers/Backend/LpaController.php`)
  - `create()` - Display LPA creation form
  - `store()` - Save LPA and auto-generate PDF
  - `show()` - View LPA details
  - `downloadPdf()` - Download PDF file
  - `previewPdf()` - Preview PDF in browser
  - `regeneratePdf()` - Regenerate PDF
  - `processPayment()` - Handle payment and remove draft status
  - `index()` - List user's LPAs
  - `destroy()` - Delete LPA

**Routes** (`routes/backend.php`):
```
GET    /lpas                      - List all LPAs
GET    /lpas/create               - Create form
POST   /lpas                      - Store LPA
GET    /lpas/{lpa}                - Show LPA
DELETE /lpas/{lpa}                - Delete LPA
GET    /lpas/{lpa}/pdf/download   - Download PDF
GET    /lpas/{lpa}/pdf/preview    - Preview PDF
POST   /lpas/{lpa}/pdf/regenerate - Regenerate PDF
POST   /lpas/{lpa}/payment        - Process payment
```

### 6. Authorization
- **LpaPolicy** (`app/Policies/LpaPolicy.php`)
  - Users can only access their own LPAs
  - All CRUD operations authorized by user ownership

## Workflow

### 1. LPA Creation Flow
```
User completes form → Submit → Store in database → Auto-generate PDF (DRAFT) → Return success
```

### 2. PDF Generation
- Automatically triggered on LPA creation
- Selects template based on `document_type` field
- Applies draft watermark if `is_draft = true`
- Stores PDF in `storage/app/lpas/{user_id}/`
- Updates LPA record with PDF path and timestamp

### 3. Payment Flow
```
User initiates payment → Payment processed → Call processPayment() → 
Update status to 'completed' → Set is_draft = false → 
Regenerate PDF without watermark → Return success
```

## API Endpoints

### Store LPA
```http
POST /lpas
Content-Type: application/json

{
  "who_for": "Me",
  "document_type": "property",
  "donor_details": {...},
  "contact_details": {...},
  "attorneys": [...],
  "can_view_documents": true,
  "replacement_attorneys": [...],
  "want_replacement_attorneys": true,
  "life_sustaining_treatment": true,
  "notify_people": true,
  "applicant": "John Doe",
  "document_recipient": "Jane Doe",
  "certificate_choice": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "LPA created successfully. PDF generated in draft status.",
  "data": {
    "lpa_id": 1,
    "pdf_path": "lpas/1/lpa-property-finance-1-2026-02-26_145623.pdf",
    "is_draft": true,
    "amount": 82.00
  }
}
```

### Process Payment
```http
POST /lpas/{lpa}/payment
Content-Type: application/json

{
  "payment_reference": "PAY-123456789",
  "payment_method": "stripe"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment processed successfully. Draft status removed.",
  "data": {
    "lpa_id": 1,
    "is_draft": false,
    "status": "completed",
    "paid_at": "2026-02-26T14:56:23.000000Z"
  }
}
```

## Frontend Integration

### Update LpaCreate.tsx

Add form submission handler:

```typescript
const handleSubmit = async () => {
    try {
        const response = await fetch('/lpas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({
                who_for: selectedWhoOption,
                document_type: selectedDocumentOption,
                donor_details: donorDetails,
                contact_details: contactDetails,
                attorneys: attorneys,
                can_view_documents: canViewDocuments === 'yes',
                replacement_attorneys: replacementAttorneys,
                want_replacement_attorneys: wantReplacementAttorneys === 'yes',
                life_sustaining_treatment: lifeSustainingTreatment === 'yes',
                notify_people: notifyPeople === 'yes',
                applicant: applicant,
                document_recipient: documentRecipient,
                certificate_choice: certificateChoice === 'yes',
            }),
        });

        const data = await response.json();

        if (data.success) {
            // Show success message
            alert('LPA created successfully! PDF generated in draft status.');
            // Redirect to payment or LPA details page
            window.location.href = `/lpas/${data.data.lpa_id}`;
        }
    } catch (error) {
        console.error('Error creating LPA:', error);
        alert('Failed to create LPA. Please try again.');
    }
};
```

## Testing

### 1. Create LPA
```bash
# Test via Tinker
php artisan tinker

$user = User::first();
$lpa = Lpa::create([
    'user_id' => $user->id,
    'who_for' => 'Me',
    'document_type' => 'property',
    'donor_details' => ['title' => 'Mr', 'firstName' => 'John', 'lastName' => 'Doe'],
    'contact_details' => ['addressLine1' => '123 Main St', 'postcode' => 'AB12 3CD'],
    'attorneys' => [['firstName' => 'Jane', 'lastName' => 'Smith']],
]);

$pdfService = app(\App\Services\LpaPdfService::class);
$pdfService->generatePdf($lpa);
```

### 2. Test Payment Flow
```bash
$lpa->markAsPaid('PAY-TEST-123');
$pdfService->removeDraftWatermark($lpa);
```

### 3. Download PDF
Visit: `http://your-app.test/lpas/1/pdf/download`

## File Structure
```
app/
├── Models/
│   └── Lpa.php
├── Services/
│   └── LpaPdfService.php
├── Http/
│   └── Controllers/
│       └── Backend/
│           └── LpaController.php
├── Policies/
│   └── LpaPolicy.php
database/
└── migrations/
    └── 2026_02_26_085233_create_lpas_table.php
resources/
└── views/
    └── pdfs/
        ├── lpa-property-finance.blade.php
        └── lpa-health-welfare.blade.php
routes/
└── backend.php (updated)
```

## Dependencies
- `dompdf/dompdf` - PDF generation library (installed)

## Configuration
No additional configuration needed. PDFs are stored in `storage/app/lpas/`.

## Security
- Authorization via LpaPolicy
- User can only access their own LPAs
- CSRF protection on all POST routes
- File storage in private storage directory

## Next Steps
1. ✅ Database migration completed
2. ✅ Models and relationships created
3. ✅ PDF service implemented
4. ✅ Templates created
5. ✅ Controller and routes added
6. ✅ Authorization policy implemented
7. 🔄 Frontend integration (update LpaCreate.tsx to call API)
8. 🔄 Payment gateway integration
9. 🔄 Email notifications for completed LPAs
10. 🔄 Admin panel for LPA management

## Notes
- PDFs are generated with A4 paper size
- Draft watermark is semi-transparent red text at 45-degree angle
- Official OPG styling matches government templates
- Payment amount is £82.00 per LPA (configurable in controller)
- All lint warnings about `authorize()` and `download()` methods are false positives from IDE - these are Laravel framework methods
