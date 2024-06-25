require('dotenv').config();
const axios = require('axios');

const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_REST_API_KEY;

(async () => {
  const notification = {
    app_id: APP_ID,
    included_segments: ['All'],
    contents: {
      en: "Hello OneSignal!"
    },
  };

  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', notification, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${API_KEY}` // .env não funciona
      }
    });
    console.log('Notification sent successfully, ID:', response.data.id);
  } catch (e) {
    console.error('Error sending notification:', e.response ? e.response.data : e);
  }
})();
