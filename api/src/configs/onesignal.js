require('dotenv').config();
const OneSignal = require('onesignal-node');

const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_REST_API_KEY;

const client = new OneSignal.Client({
  userAuthKey: API_KEY,
  app: { appAuthKey: API_KEY, appId: APP_ID }
});

module.exports = client;
