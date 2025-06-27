import nodemailer from 'nodemailer';

interface ApiResponse {
  success: boolean;
  message: string;
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your App Password
  },
});

const generateEmailHTML = (verificationToken: string) => {
  const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - MysteryMessage</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
            MysteryMessage
          </h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Verify your email to get started
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 50px 30px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="L22 6L12 13L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <h2 style="color: #1a202c; font-size: 24px; font-weight: 600; margin: 0 0 15px 0; line-height: 1.3;">
              Please verify your email address
            </h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 35px 0;">
              We're excited to have you on board! To complete your registration and start using MysteryMessage, please verify your email address by clicking the button below.
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
              Verify Email Address
            </a>
          </div>

          <!-- Alternative Link -->
          <div style="background-color: #f7fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
            <p style="color: #4a5568; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
              Having trouble with the button? Copy and paste this link into your browser:
            </p>
            <p style="color: #667eea; font-size: 14px; word-break: break-all; margin: 0; background-color: #ffffff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
              ${verificationUrl}
            </p>
          </div>

          <!-- Footer Info -->
          <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0 0 8px 0;">
              This verification link will expire in 1 hour for security reasons.
            </p>
            <p style="color: #718096; font-size: 14px; margin: 0;">
              If you didn't create an account with MysteryMessage, you can safely ignore this email.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #1a202c; padding: 30px; text-align: center;">
          <p style="color: #a0aec0; font-size: 14px; margin: 0 0 8px 0;">
            © 2025 MysteryMessage. All rights reserved.
          </p>
          <p style="color: #718096; font-size: 12px; margin: 0;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
};

export async function sendVerificationEmail(
  email: string,
  verificationToken: string
): Promise<ApiResponse> {
  try {
    const mailOptions = {
      from: `"MysteryMessage" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Verify Your Email - MysteryMessage',
      html: generateEmailHTML(verificationToken),
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Verification email sent successfully!' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Error sending verification email',
    };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<ApiResponse> {
  try {
    const resetUrl = `http://localhost:3000/auth/new-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"MysteryMessage" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Reset Your Password - MysteryMessage',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };
    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Password reset email sent successfully!' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      message: 'Error sending password reset email',
    };
  }
}