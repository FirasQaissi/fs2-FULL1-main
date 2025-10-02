const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'smartgate.service@outlook.com',
        pass: process.env.EMAIL_PASS || 'your-email-password' // You should set this in your .env file
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken, userName) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: '"SmartGate Support" <smartgate.service@outlook.com>',
        to: email,
        subject: 'Reset Your SmartGate Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00d4aa; margin: 0;">SmartGate</h1>
              <p style="color: #666; margin: 5px 0;">Smart Lock Solutions</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #555; line-height: 1.6;">
                Hello ${userName || 'User'},
              </p>
              <p style="color: #555; line-height: 1.6;">
                We received a request to reset your password for your SmartGate account. 
                Click the button below to set a new password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #00d4aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #00d4aa; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> This link will expire in 1 hour for your security. 
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent from SmartGate Support</p>
              <p>© ${new Date().getFullYear()} SmartGate. All rights reserved.</p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent:', {
        to: email,
        messageId: result.messageId
      });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email, userName) {
    try {
      const mailOptions = {
        from: '"SmartGate Support" <smartgate.service@outlook.com>',
        to: email,
        subject: 'Welcome to SmartGate!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00d4aa; margin: 0;">Welcome to SmartGate!</h1>
              <p style="color: #666; margin: 5px 0;">Smart Lock Solutions</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
              <p style="color: #555; line-height: 1.6;">
                Thank you for joining SmartGate! We're excited to have you as part of our community.
              </p>
              <p style="color: #555; line-height: 1.6;">
                You can now explore our range of smart locks and security solutions. 
                Browse our products and find the perfect solution for your needs.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" 
                   style="background: #00d4aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Browse Products
                </a>
              </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
              <p>© ${new Date().getFullYear()} SmartGate. All rights reserved.</p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', {
        to: email,
        messageId: result.messageId
      });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }
}

module.exports = new EmailService();
