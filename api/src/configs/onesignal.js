const OneSignal = require('@onesignal/node-onesignal');

const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_REST_API_KEY;

const configuration = OneSignal.createConfiguration({
  authMethods: {
    user_key: {
      tokenProvider: {
        getToken: () => `Basic ${API_KEY}`,
      },
    },
  },
  baseServer: new OneSignal.ServerConfiguration('https://onesignal.com/api/v1', {}),
});

const client = new OneSignal.DefaultApi(configuration);

module.exports = {
  client,
  APP_ID,
};
