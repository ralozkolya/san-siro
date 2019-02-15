const axios = require('axios');
const Promise = require('bluebird');
const fs = require('fs');

const host = process.env.API_HOST;
const sendMessageHost =  host + 'sendMessage';
const sendPhotoHost =  host + 'sendPhoto';
const sendAudioHost =  host + 'sendAudio';

module.exports = async function(messages, chat_id) {

	if (messages && messages.type === 'surprise') {
		return await axios.post(sendAudioHost, {
			chat_id, audio: 'CQADAgADbgQAAvF9MUvy9MxzXg4GPQI'
		});
	}

	if (!Array.isArray(messages)) {
		messages = [ messages ];
	}

	await Promise.map(messages, async (message, index) => {

		let text, payload = { chat_id };
		if (message.type === 'markdown') {
			payload = { ...payload, text: message.text, parse_mode: 'Markdown', disable_web_page_preview: true };
		} else {
			payload.text = message;
		}

		await Promise.delay(1500 * index + 500);
		await axios.post(sendMessageHost, payload);
	});
};