const axios = require("axios");
const Promise = require("bluebird");

const host = process.env.API_HOST;
const sendMessageHost = host + "sendMessage";
const sendLocationHost = host + "sendLocation";
const sendAudioHost = host + "sendAudio";

module.exports = async function (messages, chat_id) {
  if (messages && messages.type === "surprise") {
    return axios.post(sendAudioHost, {
      chat_id,
      audio: "CQADAgADbgQAAvF9MUvy9MxzXg4GPQI",
    });
  }

  if (!Array.isArray(messages)) {
    messages = [messages];
  }

  return Promise.map(messages, async (message, index) => {
    await Promise.delay(1500 * index + 500);

    let payload = { chat_id };
    if (message.type === "location") {
      payload = { ...payload, latitude: 59.438905, longitude: 24.728469 };
      return axios.post(sendLocationHost, payload);
    }

    payload.text = message;
    return axios.post(sendMessageHost, payload);
  });
};
