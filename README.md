# 🔐 Advanced Authentication System

A full-featured **authentication system** built with **Next.js**, **NextAuth**, **PostgreSQL (NeonDB)**, **Prisma**, **Zod**, **Nodemailer**, and **ShadCN** UI.  
It supports:

- ✅ Email Verification (via Gmail)
- 🔐 Password Reset (Secure Token Flow)
- 📩 OTP-based 2FA (Two-Factor Authentication)
- 📦 Session & JWT Management
- 🌐 OAuth (Google & GitHub)
- 🛡️ Credentials Login (with secure email verification)
- 🔒 OAuth users are treated as verified by default
- 🔏 Passwords are **stored only for OAuth users**, not for credential users.

---
## Workflow
```bash
1.OAuth Users: Users logging in with Google or GitHub are automatically marked as verified. No password is stored initially.
2.Credentials Users: Must verify their email via a Gmail verification link before they can log in. Only after successful verification is the user allowed to set a password and access the app.
3.JWT & Sessions: Fully handled via NextAuth.js (you can choose between jwt or database sessions).
4.OTP/2FA: 2FA via email-based OTP is available and can be enabled per user. This adds an extra layer of security to the login process.
5.Forgot Password: Users who forget their password can initiate a password reset flow.A Gmail verification link is sent to their email to securely update their password.
```

## Tech Stack
- **Next.js** (App Router)
- **NextAuth.js** (Auth Provider)
- **PostgreSQL** (via NeonDB)
- **Prisma** (ORM)
- **Zod** (Validation)
- **Nodemailer** (Gmail-based email delivery)
- **ShadCN** (UI components)

---

## Features

| Feature                       | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| Email Verification           | Sends a Gmail-based verification link to new users                         |
| Password Reset               | Secure password reset flow via email token                                 |
| 2FA (OTP)                    | Optional 2FA using OTPs sent via email                                      |
| Session & JWT                | NextAuth-based session and JWT management                                   |
| OAuth (GitHub, Google)       | Login via GitHub and Google with built-in email verification                |
| Credentials Login            | Email/password login (requires verification first)                          |
| Gmail Integration            | All emails sent securely via Gmail (Nodemailer)                            |

---

## Environment Variables
```bash
# Database (NeonDB URL)
DATABASE_URL="postgresql://<username>:<password>@<host>/<db>?sslmode=require"
# NextAuth secret (generate one with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key"
# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
# Gmail (for nodemailer)
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-app-password" # Use Gmail App Password
#NOTE - For EMAIL_PASS, make sure you've enabled 2FA in your Gmail account and generated an App Password.
```

# Prisma setup 
```bash
npx prisma generate
npx prisma db push

#To get GUI 
npx prisma studio
```


## 🧪 Installation
```bash
git clone https://github.com/yourusername/advanced-auth-system.git

cd advanced-auth-system

npm install # or yarn / pnpm install

npm run dev
```
