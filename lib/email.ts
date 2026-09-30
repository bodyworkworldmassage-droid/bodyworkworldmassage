import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
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
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bodyworkworldmassage.com';

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
    subject: `New Account Registration: ${user.first_name} ${user.last_name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a3a2a;">New Account Awaiting Approval</h2>
        <p>A new user has registered and is awaiting approval:</p>
        <ul>
          <li><strong>Name:</strong> ${user.first_name} ${user.last_name}</li>
          <li><strong>Username:</strong> ${user.username}</li>
          <li><strong>Email:</strong> ${user.email}</li>
        </ul>
        <p>
          <a href="${approveUrl}" style="background-color: #1a3a2a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; display: inline-block; margin-top: 16px;">
            APPROVE ACCOUNT
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendUserApprovedEmail(user: UserEmailData): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Your BodyWorkWorldMassage account has been approved!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a3a2a;">Welcome, ${user.first_name}!</h2>
        <p>Your account has been approved. You can now log in and start using BodyWorkWorldMassage.</p>
        <p>
          <a href="${baseUrl}" style="background-color: #1a3a2a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; display: inline-block; margin-top: 16px;">
            LOGIN
          </a>
        </p>
      </div>
    `,
  });
}
