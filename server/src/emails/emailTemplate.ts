type PulseHubEmailParams = {
  title: string;
  description: string;
  code: string;
  expiryText?: string;
  supportingText?: string;
  preheader?: string;
};

export function buildPulseHubEmail({
  title,
  description,
  code,
  expiryText = "This code expires in 10 minutes",
  supportingText,
  preheader,
}: PulseHubEmailParams): string {
  const safePreheader = preheader || `${title} - ${description}`;
  const safeSupporting = supportingText || "If you didn't request this, you can safely ignore this email.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0e0e10;">
  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${safePreheader}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:#0e0e10;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!-- Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:480px;">
          <tr>
            <td>
              <!-- Card -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:#18181b;border:1px solid #27272a;border-radius:20px;overflow:hidden;">
                <!-- Accent bar -->
                <tr>
                  <td style="height:3px;line-height:3px;background:linear-gradient(90deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);background-color:#6366f1;"></td>
                </tr>

                <!-- Branding -->
                <tr>
                  <td align="center" style="padding:28px 24px 8px 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center">
                          <div style="display:inline-block;width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);background-color:#6366f1;text-align:center;line-height:32px;font-family:Arial,sans-serif;font-weight:800;font-size:14px;color:#ffffff;letter-spacing:-0.02em;">P</div>
                        </td>
                        <td style="padding-left:10px;" align="left">
                          <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:-0.02em;color:#fafafa;">PulseHub</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Title -->
                <tr>
                  <td align="center" style="padding:20px 24px 0 24px;">
                    <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;color:#fafafa;">${title}</h1>
                  </td>
                </tr>

                <!-- Description -->
                <tr>
                  <td align="center" style="padding:12px 24px 0 24px;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:400;line-height:1.5;color:#a1a1aa;">${description}</p>
                  </td>
                </tr>

                <!-- Code -->
                <tr>
                  <td align="center" style="padding:24px 24px 0 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:#232326;border:1px solid #2e2e33;border-radius:14px;">
                      <tr>
                        <td align="center" style="padding:18px 16px;">
                          <div style="font-family:'SF Mono',SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-size:28px;font-weight:700;letter-spacing:6px;line-height:1;color:#fafafa;">${code}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Expiry -->
                <tr>
                  <td align="center" style="padding:14px 24px 0 24px;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.02em;color:#71717a;">${expiryText}</p>
                  </td>
                </tr>

                <!-- Supporting -->
                <tr>
                  <td align="center" style="padding:20px 24px 0 24px;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;color:#71717a;">${safeSupporting}</p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:24px 24px 0 24px;">
                    <div style="height:1px;background-color:#27272a;line-height:1px;">&nbsp;</div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding:16px 24px 24px 24px;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;color:#52525b;">
                      PulseHub • Stay connected on your terms<br/>
                      This is an automated message, please do not reply.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Outside footer -->
          <tr>
            <td align="center" style="padding:16px 0 0 0;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:10px;color:#3f3f46;">© ${new Date().getFullYear()} PulseHub by ladosky. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}