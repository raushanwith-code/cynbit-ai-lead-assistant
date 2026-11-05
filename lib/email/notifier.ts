import nodemailer from "nodemailer";
import { ILead } from "@/types";
import { formatCurrencyINR } from "@/lib/utils/formatters";

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  mode: "smtp" | "simulated";
  previewUrl?: string | false;
}

export async function sendLeadNotificationEmail(lead: ILead): Promise<EmailDispatchResult> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const recipient = process.env.NOTIFICATION_EMAIL_TO || process.env.ADMIN_EMAIL || "sales@cynbit.in";

  const priorityColor =
    lead.leadScore === "High" ? "#10b981" : lead.leadScore === "Medium" ? "#3b82f6" : "#6b7280";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f3f4f6; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0e7490, #1d4ed8); padding: 28px 24px; text-align: center; }
          .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 8px; background-color: ${priorityColor}; color: #ffffff; }
          .content { padding: 28px 24px; }
          .section { margin-bottom: 20px; }
          .label { font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
          .value { font-size: 15px; color: #f8fafc; font-weight: 500; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .card { background: #1e293b; padding: 14px 18px; border-radius: 8px; border: 1px solid #334155; }
          .btn { display: inline-block; background: #06b6d4; color: #020617; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; text-align: center; }
          .footer { padding: 16px 24px; background: #090d16; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ New Cynbit AI Qualified Lead</h1>
            <span class="badge">${lead.leadScore} Priority Lead</span>
          </div>
          <div class="content">
            <div class="section">
              <div class="card">
                <div class="label">Recommended Cynbit Service</div>
                <div class="value" style="color: #38bdf8; font-size: 18px; font-weight: 700;">${lead.serviceRecommended}</div>
              </div>
            </div>

            <div class="grid section">
              <div class="card">
                <div class="label">Client Name</div>
                <div class="value">${lead.name}</div>
              </div>
              <div class="card">
                <div class="label">Email Address</div>
                <div class="value">${lead.email}</div>
              </div>
              <div class="card">
                <div class="label">Business Type</div>
                <div class="value">${lead.businessType || "Startup"}</div>
              </div>
              <div class="card">
                <div class="label">Phone / Contact</div>
                <div class="value">${lead.phone || "Not provided"}</div>
              </div>
              <div class="card">
                <div class="label">Declared Budget</div>
                <div class="value" style="color: #34d399; font-weight: 600;">${lead.budget} (${formatCurrencyINR(lead.budgetAmount)})</div>
              </div>
              <div class="card">
                <div class="label">Project Timeline</div>
                <div class="value">${lead.timeline}</div>
              </div>
            </div>

            <div class="section">
              <div class="card">
                <div class="label">Project Requirement</div>
                <div class="value" style="white-space: pre-wrap;">${lead.projectRequirement}</div>
              </div>
            </div>

            ${
              lead.aiAnalysis?.rationale
                ? `
            <div class="section">
              <div class="card" style="border-left: 4px solid #06b6d4;">
                <div class="label">AI Qualification Rationale</div>
                <div class="value" style="font-size: 13px; color: #cbd5e1;">${lead.aiAnalysis.rationale}</div>
              </div>
            </div>
            `
                : ""
            }

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin" class="btn">View in Cynbit Admin Dashboard →</a>
            </div>
          </div>
          <div class="footer">
            Cynbit Technologies Lead Dispatch Engine • https://cynbit.in
          </div>
        </div>
      </body>
    </html>
  `;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log("ℹ️ [Email Notifier] SMTP not configured. Notification simulated successfully for lead:", {
      name: lead.name,
      email: lead.email,
      service: lead.serviceRecommended,
      budget: lead.budget,
      score: lead.leadScore,
    });
    return {
      success: true,
      mode: "simulated",
      messageId: `sim_${Date.now()}`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Cynbit AI Assistant" <${smtpUser}>`,
      to: recipient,
      subject: `🔥 [${lead.leadScore} Priority] New Lead: ${lead.name} (${lead.serviceRecommended})`,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: info.messageId,
      mode: "smtp",
    };
  } catch (err) {
    console.error("⚠️ Failed to send lead notification email via SMTP:", err);
    return {
      success: false,
      mode: "smtp",
    };
  }
}
