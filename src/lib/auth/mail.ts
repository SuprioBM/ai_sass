export async function sendVerificationEmail(email: string, token: string) {
  try {
    const nodemailer = await import("nodemailer"); // ✅ dynamic import

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

    const info = await transporter.sendMail({
      from: `"MicroSaaS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your account",
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`,
    });

    console.log("Verification email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}
