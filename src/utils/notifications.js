const axios = require('axios');
const nodemailer = require('nodemailer');

/**
 * Send Email via Brevo API v3 (Primary) with Nodemailer SMTP fallback
 */
const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || process.env.EMAIL_USER || 'info@vayushrihospital.com';
  const senderName = process.env.SENDER_NAME || 'Vayushri Hospital';

  // 1. Try Brevo REST API v3
  if (brevoApiKey && brevoApiKey !== 'your_brevo_api_key_here') {
    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { name: senderName, email: senderEmail },
          to: [{ email: toEmail, name: toName || toEmail }],
          subject: subject,
          htmlContent: htmlContent,
        },
        {
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log(`✅ [Brevo API] Email successfully sent to ${toEmail} (MessageId: ${response.data?.messageId || 'ok'})`);
      return true;
    } catch (error) {
      console.error('❌ [Brevo API] Error sending email:', error.response?.data || error.message);
      return false;
    }
  }

  // 2. Fallback to Nodemailer SMTP (if configured)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${senderName}" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: subject,
        html: htmlContent,
      });

      console.log(`✅ [Nodemailer SMTP] Email sent to ${toEmail}`);
      return true;
    } catch (error) {
      console.error('❌ [Nodemailer SMTP] Error sending email:', error.message);
      return false;
    }
  }

  console.warn('⚠️ No active email service configured (missing BREVO_API_KEY or SMTP credentials)');
  return false;
};

/**
 * Send email notification to hospital admin
 */
const sendHospitalNotification = async (appointmentData) => {
  const hospitalEmail = process.env.HOSPITAL_EMAIL || 'info@vayushrihospital.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6B3FA0 0%, #7A48B7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0;">🏥 New Appointment Booking</h2>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333;">A new patient appointment has been booked. Details below:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background: white;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Patient Name</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.fullName}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Age</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.age}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.phoneNumber}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.emailAddress || 'N/A'}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Specialty</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.specialty}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Doctor</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.preferredDoctor || 'Any Available'}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Date</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${new Date(appointmentData.preferredDate).toLocaleDateString('en-GB')}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Time Slot</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.preferredTime}</td>
          </tr>
        </table>
        
        ${appointmentData.additionalNotes ? `
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
          <strong>Additional Notes:</strong><br>
          ${appointmentData.additionalNotes}
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Automated notification from Vayushri Hospital Booking System.</p>
          <p>Booked at: ${new Date().toLocaleString('en-GB')}</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    toEmail: hospitalEmail,
    toName: 'Vayushri Hospital Admin',
    subject: `🏥 New Appointment: ${appointmentData.fullName} (${appointmentData.specialty})`,
    htmlContent,
  });
};

/**
 * Send confirmation email to user/patient
 */
const sendUserConfirmation = async (appointmentData) => {
  if (!appointmentData.emailAddress) {
    console.log('ℹ️ No email provided for user, skipping user confirmation');
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6B3FA0 0%, #7A48B7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0;">Appointment Confirmed! 🎉</h2>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
        <p style="font-size: 16px; color: #333;">Dear <strong>${appointmentData.fullName}</strong>,</p>
        
        <p style="color: #555; line-height: 1.6;">Thank you for choosing Vayushri Hospital. Your appointment has been successfully booked. Here are your details:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #6B3FA0;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 40%;">Specialty:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">${appointmentData.specialty}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Doctor:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">${appointmentData.preferredDoctor || 'Any Available Doctor'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">${new Date(appointmentData.preferredDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Time Slot:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">${appointmentData.preferredTime}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f3e8ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #6B3FA0;">
          <p style="margin: 0; color: #4A247A; font-weight: bold;">📍 Location & Address:</p>
          <p style="margin: 5px 0 0 0; color: #333;">
            <strong>Vayushri Hospital</strong><br>
            200 feet radial road, Opp to Embassy, Pallavaram<br>
            Chennai - 600044, Tamil Nadu<br>
            Phone: +91 77085 55635
          </p>
        </div>
        
        <div style="margin-top: 20px;">
          <p style="color: #666; margin-bottom: 10px;"><strong>What to bring:</strong></p>
          <ul style="color: #555; line-height: 1.8;">
            <li>Government-issued ID proof</li>
            <li>Previous medical records (if any)</li>
            <li>List of current medications</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>⚠️ Note:</strong> Please arrive 15 minutes before your scheduled slot. If you need to reschedule, call us at 7708555635.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666;">Need help? Contact us:</p>
          <p style="color: #333; font-weight: bold;">📞 +91 77085 55635 | 📧 info@vayushrihospital.com</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    toEmail: appointmentData.emailAddress,
    toName: appointmentData.fullName,
    subject: `Appointment Confirmed - Vayushri Hospital (${appointmentData.specialty})`,
    htmlContent,
  });
};

/**
 * Send webhook notification to external service (if configured)
 */
const sendWebhookNotification = async (appointmentData) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) return false;

    const payload = {
      event: 'appointment_booked',
      timestamp: new Date().toISOString(),
      data: {
        patientName: appointmentData.fullName,
        patientAge: appointmentData.age,
        patientPhone: appointmentData.phoneNumber,
        patientEmail: appointmentData.emailAddress,
        specialty: appointmentData.specialty,
        doctor: appointmentData.preferredDoctor,
        appointmentDate: appointmentData.preferredDate,
        appointmentTime: appointmentData.preferredTime,
        notes: appointmentData.additionalNotes,
        bookedAt: new Date().toISOString(),
      },
    };

    await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.WEBHOOK_SECRET ? `Bearer ${process.env.WEBHOOK_SECRET}` : undefined,
      },
      timeout: 5000,
    });

    console.log('✅ Webhook notification sent');
    return true;
  } catch (error) {
    console.error('❌ Error sending webhook notification:', error.message);
    return false;
  }
};

/**
 * Main notification dispatcher
 */
const sendAppointmentNotifications = async (appointmentData) => {
  console.log('📧 Dispatching appointment notifications...');
  
  const results = await Promise.allSettled([
    sendHospitalNotification(appointmentData),
    sendUserConfirmation(appointmentData),
    sendWebhookNotification(appointmentData),
  ]);

  const summary = {
    hospitalEmail: results[0].status === 'fulfilled' && results[0].value,
    userEmail: results[1].status === 'fulfilled' && results[1].value,
    webhook: results[2].status === 'fulfilled' && results[2].value,
  };

  console.log('📊 Notification summary:', summary);
  return summary;
};

module.exports = {
  sendAppointmentNotifications,
  sendHospitalNotification,
  sendUserConfirmation,
  sendWebhookNotification,
};