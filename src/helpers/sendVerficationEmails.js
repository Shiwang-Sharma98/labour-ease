import nodemailer from 'nodemailer';

// Create a transporter using SMTP
export function createEmailTransporter() {
  // Check if environment variables are set - using the correct variable names
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('Email credentials not found in environment variables');
    throw new Error('Email credentials not configured. Please set MAIL_USER and MAIL_PASS in your .env file');
  }

  return nodemailer.createTransport({
    service: 'gmail', // Or another email service
    auth: {
      user: process.env.MAIL_USER, // Using MAIL_USER from your .env
      pass: process.env.MAIL_PASS  // Using MAIL_PASS from your .env
    }
  });
}

// Function to send verification email
export async function sendVerificationEmail(email, username, verifyCode) {
  try {
    // Validate inputs
    if (!email || !username || !verifyCode) {
      console.error('Missing required parameters', { email, username, verifyCodeProvided: !!verifyCode });
      return {
        success: false,
        message: 'Invalid input parameters.',
      };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return {
        success: false,
        message: 'Invalid email format.',
      };
    }
    
    // Create transporter with error handling
    let transporter;
    try {
      transporter = createEmailTransporter();
      console.log('Email transporter created successfully with credentials:', { 
        user: process.env.MAIL_USER?.substring(0, 5) + '...',  // Only log partial email for security
        passProvided: !!process.env.MAIL_PASS
      });
    } catch (transporterError) {
      console.error('Failed to create email transporter:', transporterError);
      return {
        success: false,
        message: 'Email service configuration error.',
        error: transporterError.message
      };
    }
    
    // Email options
    const mailOptions = {
      from: `"Labour Ease" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Labour Ease - Account Verification',
      text: `
Hello ${username},

Your verification code for Labour Ease is: ${verifyCode}

Please use this code to complete your registration.

If you did not request this verification, please ignore this email.

Best regards,
Labour Ease Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
  <h2 style="color: #4a5568; text-align: center;">Labour Ease - Account Verification</h2>
  
  <p>Hello ${username},</p>
  
  <p>Your verification code is:</p>
  
  <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
    ${verifyCode}
  </div>
  
  <p>Please use this code to complete your registration.</p>
  
  <p>If you did not request this verification, please ignore this email.</p>
  
  <p>Best regards,<br>Labour Ease Team</p>
</div>
      `
    };
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    // Log the result for debugging
    console.log('Email send result:', result);
    
    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  } catch (emailError) {
    // Log the full error for comprehensive debugging
    console.error('Comprehensive email sending error:', {
      message: emailError.message,
      name: emailError.name,
      stack: emailError.stack,
    });
        
    return {
      success: false,
      message: 'Failed to send verification email.',
      error: emailError.message,
    };
  }
}