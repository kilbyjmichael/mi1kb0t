var request = require('request');
var ddg = require('ddg');

module.exports = {listeners: [
{
	type: "startsWith",
	query: ".ddg",
	callback: function(reply, message, api){
		if(message.body.length === 3)
			return reply("Usage: .ddg <term>");
		duck(message.body.substr(5), reply, message, api);
	}
}, {
	type: "startsWith",
	query: ".duckduckgo",
	callback: function(reply, message, api){
		if(message.body.length === 10)
			return reply("Usage: .duckduckgo <term>");
		duck(message.body.substr(12), reply, message, api);
	}
}
]};

var error = function(code, msg){
	console.log(msg);
	reply({attachment: request("https://http.cat/" + code + ".jpg")});
};

function duck(term, reply, message, api){
	if(api.type === "messenger")
		api.sendTypingIndicator(message.thread_id);
    ddg.query(term, function(err, data) {
    if(data.AbstractText !== '') {
        reply(data.AbstractText);
        reply({attachment: request(data.Image)}, function(err){
		    if(err) return error(404, err);
		});
    }
    else {
        reply('I couldn\'t find that sorry...');
    }
  });
}
