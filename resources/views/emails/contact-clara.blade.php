<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Business Opportunity Contact</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: #0f182e;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .contact-info {
            background: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #0f182e;
        }
        .field {
            margin: 10px 0;
        }
        .label {
            font-weight: bold;
            color: #0f182e;
            display: inline-block;
            width: 120px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 New Business Opportunity Contact</h1>
        <p>Will Writing Online Platform Inquiry</p>
    </div>

    <div class="content">
        <p>Hi Clara,</p>
        
        <p>You have a new contact inquiry from someone interested in the Will Writing Online business opportunity. Here are their details:</p>

        <div class="contact-info">
            <div class="field">
                <span class="label">Name:</span>
                {{ $contactData['firstName'] }} {{ $contactData['lastName'] }}
            </div>
            <div class="field">
                <span class="label">Email:</span>
                {{ $contactData['email'] }}
            </div>
            <div class="field">
                <span class="label">Phone:</span>
                {{ $contactData['phone'] }}
            </div>
            @if(!empty($contactData['message']))
            <div class="field">
                <span class="label">Message:</span><br>
                {{ $contactData['message'] }}
            </div>
            @endif
        </div>

        <p><strong>Next Steps:</strong></p>
        <ul>
            <li>Contact the prospect within 24 hours</li>
            <li>Provide information about the platform</li>
            <li>Answer any questions about the business opportunity</li>
            <li>Guide them through the purchase process if interested</li>
        </ul>

        <p>This inquiry came from the investment opportunity page on your website.</p>
    </div>

    <div class="footer">
        <p>📧 This is an automated message from the Will Writing Online platform</p>
        <p>🔄 Please respond to {{ $contactData['email'] }} to follow up with this prospect</p>
    </div>
</body>
</html>
