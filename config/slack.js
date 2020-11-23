module.exports = {
  token: process.env.SLACK_TOKEN || false,
  defaultChannel: process.env.SLACK_DEFAULT_CHANNEL || false,
  clientId: process.env.SLACK_CLIENT_ID || false,
  clientSecret: process.env.SLACK_CLIENT_SECRET || false,
  signingSecret: process.env.SLACK_SIGNING_SECRET || false,
};
