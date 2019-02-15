const assert = require('assert');

module.exports = function(body) {
	assert(body, 'Request must be POST application/json');
	assert(body.message, "Request must contain 'message'");
	assert(body.message.from, "Request must contain 'message.from'");
	assert(body.message.from.id, "Request must contain 'message.from.id'");
	assert(body.message.from.first_name, "Request must contain 'message.from.first_name'");
	assert(body.message.text, "Request must contain 'message.text'");
	assert(body.message.chat, "Request must contain 'message.chat'");
	assert(body.message.chat.id, "Request must contain 'message.chat.id'");

	const { message: { from: { id: user_id, first_name }, chat: { id: chat_id }, text, entities } } = body;

	return { first_name, user_id, chat_id, text, entities };
};