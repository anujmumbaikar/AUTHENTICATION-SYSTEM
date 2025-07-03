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
      <title>Verify Your Email - SecureAuth</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
            SecureAuth
          </h1>
          <p style="color: #cbd5e1; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            Verify your email to get started
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 50px 30px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #334155 0%, #1e293b 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="L22 6L12 13L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 15px 0; line-height: 1.3;">
              Please verify your email address
            </h2>
            
            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 35px 0;">
              We're excited to have you on board! To complete your registration and start using SecureAuth, please verify your email address by clicking the button below.
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #334155 0%, #1e293b 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(51, 65, 85, 0.4); transition: all 0.3s ease;">
              Verify Email Address
            </a>
          </div>

          <!-- Alternative Link -->
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; margin: 30px 0;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
              Having trouble with the button? Copy and paste this link into your browser:
            </p>
            <p style="color: #334155; font-size: 14px; word-break: break-all; margin: 0; background-color: #ffffff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
              ${verificationUrl}
            </p>
          </div>

          <!-- Footer Info -->
          <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
              This verification link will expire in 1 hour for security reasons.
            </p>
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              If you didn't create an account with SecureAuth, you can safely ignore this email.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #1e293b; padding: 30px; text-align: center;">
          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px 0;">
            © 2025 SecureAuth. All rights reserved.
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 0;">
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
      from: `"SecureAuth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Verify Your Email - SecureAuth',
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
      from: `"SecureAuth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Reset Your Password - SecureAuth',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - SecureAuth</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                SecureAuth
              </h1>
              <p style="color: #cbd5e1; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Reset your password
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 50px 30px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #334155 0%, #1e293b 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9V11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                
                <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 15px 0; line-height: 1.3;">
                  Reset your password
                </h2>
                
                <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 35px 0;">
                  We received a request to reset your password. Click the button below to set a new password for your account.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #334155 0%, #1e293b 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(51, 65, 85, 0.4); transition: all 0.3s ease;">
                  Reset Password
                </a>
              </div>

              <!-- Alternative Link -->
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 25px; margin: 30px 0;">
                <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                  Having trouble with the button? Copy and paste this link into your browser:
                </p>
                <p style="color: #334155; font-size: 14px; word-break: break-all; margin: 0; background-color: #ffffff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
                  ${resetUrl}
                </p>
              </div>

              <!-- Footer Info -->
              <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                  This password reset link will expire in 1 hour for security reasons.
                </p>
                <p style="color: #64748b; font-size: 14px; margin: 0;">
                  If you didn't request a password reset, you can safely ignore this email.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px 0;">
                © 2025 SecureAuth. All rights reserved.
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>

          </div>
        </body>
        </html>
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

export const sendTwoFactorTokenEmail = async (
  email: string,
  twoFactorToken: string
): Promise<ApiResponse> => {
  try {
    const mailOptions = {
      from: `"SecureAuth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Your Two-Factor Authentication Code - SecureAuth',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Two-Factor Authentication Code - SecureAuth</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                SecureAuth
              </h1>
              <p style="color: #cbd5e1; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Two-Factor Authentication
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 50px 30px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #334155 0%, #1e293b 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                
                <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 15px 0; line-height: 1.3;">
                  Your verification code
                </h2>
                
                <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 35px 0;">
                  Enter this code to complete your two-factor authentication:
                </p>
              </div>

              <!-- Token Display -->
              <div style="text-align: center; margin: 40px 0;">
                <div style="background: #f1f5f9; border: 2px solid #334155; border-radius: 12px; padding: 25px; margin: 0 auto; display: inline-block;">
                  <p style="color: #334155; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: 6px; font-family: 'Courier New', monospace;">
                    ${twoFactorToken}
                  </p>
                </div>
              </div>

              <!-- Footer Info -->
              <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                  This code is valid for 10 minutes and can only be used once.
                </p>
                <p style="color: #64748b; font-size: 14px; margin: 0;">
                  If you didn't request this code, please secure your account immediately.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px 0;">
                © 2025 SecureAuth. All rights reserved.
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Two-factor authentication email sent successfully!' };
  } catch (error) {
    console.error('Error sending two-factor token email:', error);
    return {
      success: false,
      message: 'Error sending two-factor token email',
    };
  }
};