// controllers/whatsappController.js
import twilio from 'twilio';
import User from '../models/User.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsAppAlerts = async (req, res) => {
  const { message, userIds } = req.body;

  try {
    const users = await User.find({ _id: { $in: userIds } });

    for (const user of users) {
      if (user.phoneNumber) {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: `whatsapp:${user.phoneNumber}`
        });
      }
    }

    res.status(200).json({ success: true, message: 'Messages sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
