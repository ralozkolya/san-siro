const fs = require('fs');

const url = 'https://google.com/';

let messages = fs.readFileSync('./messages.json').toString();
messages = JSON.parse(messages.replace(/%_URL/g, url));

const cache = {};

function isCorrect(text) {
	const regex = /san[\s\-_]?siro|სან[\s\-_]?სირო/gi;
	return !!(String(text).match(regex));
}

function isQuestion(text) {
	return String(text).includes('?');
}

function getCommand(text, entities) {
	if (entities && Array.isArray(entities)) {
		for (const entity of entities) {
			if (entity.type === 'bot_command') {
				return text.substr(entity.offset + 1, entity.length);
			}
		}
	}
	return null;
}

function isMate(text) {
	const names = [
		// full first
		'nikoloz', 'anna', 'ketevan', 'giorgi', 'tornike', 'nino', 'sandro', 'elene', 'alex', 'anano',
		'ნიკოლოზ', 'ანნა', 'ქეთევან', 'გიორგი', 'თორნიკე', 'ნინო', 'სანდრო', 'ელენე', 'ალექს', 'ანანო',
		// Nicknames
		'kolya', 'katie', 'gio', 'toko', 'elle',
		'კოლია', 'კაწი', 'გიო', 'თოკო', 'ელი',
		// Alternatives
		'klaus', 'ana', 'george', 'coach', 'volk', 'eleanor', 'ele', 'viki',
		'კლაუს', 'ანა', 'ჯორჯ', 'ვოლკ', 'ელეანორ', 'ელე', 'ვიკი'
	];
	return names.some(name => text.match(new RegExp(name, 'gi')));
}

function getRandomMessage(key) {
	let message = messages.key[key] || 'ჰმმ...';
	if (Array.isArray(message)) {
		message = messages[Math.floor(Math.random() * messages.length)];
	}
	return message;
}

module.exports = function({ user_id, first_name, text, entities }) {

	const cached = cache[user_id] = cache[user_id] || { tries: 0, mateTries: 0 };

	let command;
	if (command = getCommand(text, entities)) {
		switch (command) {
			case 'san_siro':
			case 'start':
			case 'reset':
				delete cache[user_id];
		}
		return messages[command] || messages.help;
	}

	if (isCorrect(text)) {
		const tries = cached.tries;
		delete cache[user_id];
		return tries < messages.error.length ? messages.success : messages.san_siro;
	}

	if (isQuestion(text)) {
		return messages.question;
	}

	if (isMate(text)) {
		return messages.mate[cached.mateTries++] || messages.mateDefault;
	}

	return messages.error[cached.tries++] || messages.errorDefault;

};
