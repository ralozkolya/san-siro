const createError = require('http-errors');

const parseRequest = require('../src/parse-request');
const handleMessage = require('../src/handle-message');
const sendMessages = require('../src/sender');

const token = process.env.TG_TOKEN;

export default async function hook(req, res) {

    if (req.query.hook !== token) {
        return res.status(400).end();
    }

    const parsed = parseRequest(req.body);
    const messages = handleMessage(parsed);
    await sendMessages(messages, parsed.chat_id);
    res.end();
}
