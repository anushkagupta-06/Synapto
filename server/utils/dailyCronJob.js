import cron from 'node-cron';
import Deadline from './models/Deadline.js';
import { sendWhatsApp } from './controllers/whatsappController.js';

cron.schedule('0 9 * * *', async () => {
  const today = new Date();
  const deadlines = await Deadline.find({ done: false, sent: false });

  for (const deadline of deadlines) {
    const remindDate = new Date(deadline.deadline);
    remindDate.setDate(remindDate.getDate() - deadline.remindBeforeDays);

    const isToday = today.toDateString() === remindDate.toDateString();

    if (isToday) {
      await sendWhatsApp({
        to: deadline.phoneNumber,
        body: `🔔 Reminder: ${deadline.title}\n${deadline.content}`
      });
      deadline.sent = true;
      await deadline.save();
    }
  }
});

