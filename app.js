const BlockchainInfoSocket = require('blockchain.info/Socket');
const TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');

var conf = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var spy = JSON.parse(fs.readFileSync('addresses.json', 'utf8'));

const bot = new TelegramBot(conf['telegram_key'], {polling: true});

//tx = JSON.parse(fs.readFileSync('test.json', 'utf8'));


var bis = new BlockchainInfoSocket();

var addresses = [];
spy.forEach(function (value) {
    addresses.push(value['addr'])
});

bis.onTransaction(function (tx) {
    console.log("Detect transaction");

    tx['inputs'].forEach(function (entry) {
        spy.forEach(function (s) {
            if (entry['prev_out']['addr'] == s['addr']) {
                console.log(s['addr'] + ' ' + (0 - entry['prev_out'] / 100000000));
                send_notify(s['addr'], s['tag'], (0 - entry['prev_out']['value'] / 100000000), 0);
            }
        })
    });

    tx['out'].forEach(function (entry) {
        spy.forEach(function (s) {
            if (entry['addr'] == s['addr']) {
                console.log(s['addr'] + ' ' + (entry['value'] / 100000000));
                send_notify(s['addr'], s['tag'], (entry['value'] / 100000000), 1);
            }
        })
    });

    //console.log(data)
}, {
    "addresses": addresses
});


function send_notify(addr, tag, value, type) {
    if (value > 999 || value < -999) {
        bot.sendMessage(conf['telegram_chat_id'],
            "Tag: <b>" + tag + '</b>\nAddress: ' + addr + "\n" + "Change: <b>" + value + " BTC</b>",
            {
                parse_mode: "HTML"
            }
        )
    }
}

bot.onText(/\/info/, function (msg, match) {

    const chatId = msg.chat.id;
    //const resp = match[1]; // the captured "whatever"

    bot.sendMessage(chatId, "Genesis Bot [0.0.1]");
});