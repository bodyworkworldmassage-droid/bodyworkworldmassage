import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export interface UserEmailData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

export async function sendAdminApprovalEmail(user: UserEmailData, approvalToken: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const approveUrl = `${baseUrl}/api/auth/approve?token=${approvalToken}`;
  const adminEmail = process.env.ADMIN_EMAIL || 'bodyworkworldmassage@gmail.com';

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"BodyWorkWorld Massage" <${process.env.SMTP_FROM}>`,
    to: adminEmail,
    subject: `New Provider Registration: ${user.first_name} ${user.last_name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a3a2a;">New Provider Awaiting Approval</h2>
        <p>A new provider has registered and is awaiting your approval:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;font-weight:600;width:140px">Name</td><td style="padding:8px">${user.first_name} ${user.last_name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:600">Username</td><td style="padding:8px">${user.username}</td></tr>
          <tr><td style="padding:8px;font-weight:600">Email</td><td style="padding:8px">${user.email}</td></tr>
        </table>
        <p style="margin-top:24px">
          <a href="${approveUrl}" style="background-color:#1a3a2a;color:white;padding:14px 28px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:600;font-size:15px;">
            ✅ APPROVE ACCOUNT
          </a>
        </p>
        <p style="margin-top:16px;font-size:12px;color:#888">This approval link expires in 7 days.</p>
      </div>
    `,
  });
}

export async function sendUserApprovedEmail(user: UserEmailData): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"BodyWorkWorld Massage" <${process.env.SMTP_FROM}>`,
    to: user.email,
    subject: 'Your BodyWorkWorldMassage account has been approved!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a3a2a;">Welcome, ${user.first_name}!</h2>
        <p>Great news — your provider account on <strong>BodyWorkWorldMassage</strong> has been approved.</p>
        <p>You can now log in, complete your profile, and add your listings.</p>
        <p style="margin-top:24px">
          <a href="${baseUrl}" style="background-color:#1a3a2a;color:white;padding:14px 28px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:600;font-size:15px;">
            LOGIN NOW
          </a>
        </p>
      </div>
    `,
  });
}
