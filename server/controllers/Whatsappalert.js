// controllers/whatsappController.js
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsAppAlerts = async (req, res) => {
  const { message } = req.body;

  try {
    // const users = await User.find({ _id: { $in: userIds } });

    // for (const user of users) {
    //   if (user.phoneNumber) {
        await client.messages.create({
          from: 'whatsapp:+14155238886',
          to: `whatsapp:+918368431686`,
          body: message
        });
    //   }
    // }

    res.status(200).json({ success: true, message: 'Custom messages sent!' });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
