const { WebClient } = require('@slack/web-api');

// regenerate slackToken
const getToken = ({
    clientId,
    clientSecret,
    // signingSecret,
    // code, // retrieve this from slack auth grant
}) => {
    return new Promise((resolve, reject) => {
        try {
            (new WebClient()).oauth.v2.access({
                client_id: clientId,
                client_secret: clientSecret,
                // code, // retrieve this from slack auth grant
            })
                .then(result => {
                    resolve(result.access_token);
                })
                .catch(error => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
};

const send = (client, defaultChannel) => (text, channel) => {
    return new Promise((resolve, reject) => {
        try {
            client.chat.postMessage({
                channel: channel || defaultChannel,
                text,
            })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = ({
    token = false,
    defaultChannel,
    clientId,
    clientSecret,
    signingSecret,
}) => {
    return new Promise((resolve, reject) => {
        try {
            if (token) {
                const client = new WebClient(token);
                resolve(send(client, defaultChannel));
            } else {
                // get slack auth grant here
                getToken({
                    clientId,
                    clientSecret,
                    signingSecret,
                    // code, // retrieve this from slack auth grant
                })
                    .then(newToken => {
                        const client = new WebClient(newToken);
                        resolve(send(client, defaultChannel));
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        } catch (error) {
            reject(error);
        }
    });
};
