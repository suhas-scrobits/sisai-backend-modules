export const REPORT_BODY = `
        <p>We wanted to inform you that your requested data has been successfully exported. You can find the exported data in the attached file.</p>
        <!-- Add a placeholder for the attachment link -->
        <p>If you have any questions or concerns about the exported data, please feel free to contact us. Your satisfaction is our priority.</p>        
`;

export const EMAIL_TEMPLATE_REPORT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Export Notification - Sisai</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello 👋</h2>
        {{BODY}}
        <p>Thank you for choosing Sisai!</p>
        <p>Best regards,</p>
        <p>The Sisai Team</p>
    </div>
</body>
</html>
`;
