const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');

require('dotenv').config();

const parseRequest = require('./src/parse-request');
const handleMessage = require('./src/handle-message');
const sendMessages = require('./src/sender');

const token = process.env.TG_TOKEN;
const port = process.env.PORT || 8443;

const app = express();

app.use(bodyParser.json());

app.post(`/${token}`, async (req, res, next) => {
	res.status(204).end();
	try {
		const parsed = parseRequest(req.body);
		console.log(`Got message: ${parsed.user_id}`);
		const messages = handleMessage(parsed);
		await sendMessages(messages, parsed.chat_id);
	} catch (e) {
		console.log(e.message);
	}
});

https.createServer({
	key: fs.readFileSync('./cert/privkey1.pem'),
	cert: fs.readFileSync('./cert/fullchain1.pem'),
}, app).listen(port, () => console.log(`Listening to port '${port}'`));
