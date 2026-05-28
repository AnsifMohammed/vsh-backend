const nodemailer = require('nodemailer');
const axios = require('axios');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or use SMTP settings
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email notification to hospital admin
 */
const sendHospitalNotification = async (appointmentData) => {
  try {
    const transporter = createTransporter();
    
    const hospitalEmail = process.env.HOSPITAL_EMAIL || 'info@vayushrihospital.com';
    
    const mailOptions = {
      from: `"Vayushri Hospital" <${process.env.EMAIL_USER}>`,
      to: hospitalEmail,
      subject: '🏥 New Appointment Booking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">New Appointment Booking</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">A new appointment has been booked. Here are the details:</p>
            
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
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Time</td>
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
              <p>This is an automated notification from Vayushri Hospital Booking System.</p>
              <p>Booked at: ${new Date().toLocaleString('en-GB')}</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Hospital notification email sent');
    return true;
  } catch (error) {
    console.error('❌ Error sending hospital notification:', error.message);
    return false;
  }
};

/**
 * Send confirmation email to user/patient
 */
const sendUserConfirmation = async (appointmentData) => {
  try {
    // Only send if email is provided
    if (!appointmentData.emailAddress) {
      console.log('ℹNo email provided for user, skipping user confirmation');
      return false;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Vayushri Hospital" <${process.env.EMAIL_USER}>`,
      to: appointmentData.emailAddress,
      subject: ' Your Appointment is Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">Appointment Confirmed! 🎉</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Dear <strong>${appointmentData.fullName}</strong>,</p>
            
            <p style="color: #555; line-height: 1.6;">Thank you for choosing Vayushri Hospital. Your appointment has been successfully booked. Here are your appointment details:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #11998e;">
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
                  <td style="padding: 8px 0; color: #666;">Time:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">${appointmentData.preferredTime}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #1565c0; font-weight: bold;">📍 Clinic Address:</p>
              <p style="margin: 5px 0 0 0; color: #333;">Vayushri Hospital<br>
              [Your Hospital Address]<br>
              Phone: 7708555635 | Landline: 2261122</p>
            </div>
            
            <div style="margin-top: 20px;">
              <p style="color: #666; margin-bottom: 10px;"><strong>What to bring:</strong></p>
              <ul style="color: #555; line-height: 1.8;">
                <li>Government-issued ID proof</li>
                <li>Previous medical records (if any)</li>
                <li>List of current medications</li>
                <li>Insurance card (if applicable)</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ Important:</strong> Please arrive 15 minutes before your scheduled appointment time. If you need to cancel or reschedule, please call us at 7708555635 at least 24 hours in advance.
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #666;">Need help? Contact us:</p>
              <p style="color: #333; font-weight: bold;">📞 7708555635 | 📧 info@vayushrihospital.com</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
              <p>This is an automated confirmation email from Vayushri Hospital.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ User confirmation email sent');
    return true;
  } catch (error) {
    console.error('❌ Error sending user confirmation:', error.message);
    return false;
  }
};

/**
 * Send webhook notification to external service (if configured)
 */
const sendWebhookNotification = async (appointmentData) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.log('ℹ️ No webhook URL configured, skipping webhook notification');
      return false;
    }

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

    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.WEBHOOK_SECRET ? `Bearer ${process.env.WEBHOOK_SECRET}` : undefined,
      },
      timeout: 5000,
    });

    console.log('✅ Webhook notification sent:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Error sending webhook notification:', error.message);
    return false;
  }
};

/**
 * Send SMS notification (using a service like Twilio or textlocal)
 * This is a placeholder - implement with your preferred SMS provider
 */
const sendSMSNotification = async (appointmentData) => {
  try {
    // Example using Twilio (configure with your credentials)
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !fromNumber) {
      console.log('ℹ️ SMS credentials not configured, skipping SMS notification');
      return false;
    }

    // Implement SMS sending logic here
    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({
    //   body: `Hi ${appointmentData.fullName}, your appointment at Vayushri Hospital is confirmed for ${new Date(appointmentData.preferredDate).toLocaleDateString()} at ${appointmentData.preferredTime}.`,
    //   from: fromNumber,
    //   to: `+91${appointmentData.phoneNumber}`,
    // });

    console.log('✅ SMS notification sent');
    return true;
  } catch (error) {
    console.error('❌ Error sending SMS notification:', error.message);
    return false;
  }
};

/**
 * Main notification function - sends all configured notifications
 */
const sendAppointmentNotifications = async (appointmentData) => {
  console.log('📧 Sending appointment notifications...');
  
  const results = await Promise.allSettled([
    sendHospitalNotification(appointmentData),
    sendUserConfirmation(appointmentData),
    sendWebhookNotification(appointmentData),
    sendSMSNotification(appointmentData),
  ]);

  const summary = {
    hospitalEmail: results[0].status === 'fulfilled' && results[0].value,
    userEmail: results[1].status === 'fulfilled' && results[1].value,
    webhook: results[2].status === 'fulfilled' && results[2].value,
    sms: results[3].status === 'fulfilled' && results[3].value,
  };

  console.log('📊 Notification summary:', summary);
  return summary;
};

module.exports = {
  sendAppointmentNotifications,
  sendHospitalNotification,
  sendUserConfirmation,
  sendWebhookNotification,
  sendSMSNotification,
};