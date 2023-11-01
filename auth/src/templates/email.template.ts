export const EMAIL_TEMPLATE_RESET_PASSWORD = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - App Name</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hey there 👋</h2>
        <p>We received a request to reset your password for your App Name account. To proceed with the password reset, please click on the link below:</p>
        <a href="{PASSWORD_RESET_URL}" style="display: inline-block; padding: 10px; background-color: #e38700; color:#ffffff; font-size: 18px; font-weight: bold; text-decoration: none;">Reset Password</a>
        <p>If you didn't initiate this password reset request, please disregard this email and contact our support team immediately.</p>
        <p>Best regards,</p>
        <p>Team App Name</p>
    </div>
</body>
</html>`;
