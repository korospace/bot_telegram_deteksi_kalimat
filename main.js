const TelegramBot = require('node-telegram-bot-api');
const axios       = require('axios');

// bot initialization
const token = '6893802324:AAF9vt50FRzkb_hQe8n8c-COvw9PEHGAk5w';
const bot   = new TelegramBot(token, { polling: true });

// api
const api_url = 'http://localhost:8080/api';

// on message
bot.on('message', (msg) => {
    if (msg.from.id !== bot.botId) {
      const chatId      = msg.chat.id;
      const messageId   = msg.message_id;
      const messageText = msg.text;
      const username    = msg.from.username;

      cekMessage(messageText,messageId,chatId,username)
    }
});

// cek message
function cekMessage(messageText, messageId='', chatId='', username='') {
  const payload = {
    raw_text: messageText
  }
  console.log("message: ",messageText);

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  axios.post(`${api_url}/training/single`, payload, config)
    .then(response => {
      const res      = response.data.data
      const category = res.best_category
      const score    = res.best_score
      console.log("response: ",res);

      if (category != 'netral') {
        deleteMessage(chatId, messageId, username, category)
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// delete message
function deleteMessage(chatId, messageId, username, category) {
  const replyMessage = `@${username}, terdeteksi kalimat ${category}!`;
  bot.sendMessage(chatId, replyMessage);

  bot.deleteMessage(chatId, messageId)
      .then(() => {
        console.error('Berhasil menghapus pesan');
      })
      .catch((error) => {
        console.error('Gagal menghapus pesan:', error);
      });
}