const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

module.exports.config = {
 name: 'removebg',
 version: '1.1.5',
 hasPermssion: 0,
 credits: 'ULLASH',
 description: 'Remove image background using Rapido API',
 usePrefix: true,
 commandCategory: 'Tools',
 usages: 'Reply to an image',
 cooldowns: 2,
 dependencies: {
 'axios': '',
 'image-downloader': '',
 'fs-extra': ''
 }
};

module.exports.run = async function({ api, event }) {
 try {
 if (event.type !== "message_reply") {
 return api.sendMessage("⚠️ | 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞.", event.threadID, event.messageID);
 }

 const attachment = event.messageReply.attachments?.[0];
 if (!attachment || attachment.type !== "photo") {
 return api.sendMessage("❌ | 𝐎𝐧𝐥𝐲 𝐢𝐦𝐚𝐠𝐞 𝐚𝐭𝐭𝐚𝐜𝐡𝐦𝐞𝐧𝐭𝐬 𝐚𝐫𝐞 𝐬𝐮𝐩𝐩𝐨𝐫𝐭𝐞d.", event.threadID, event.messageID);
 }

 const imageUrl = encodeURIComponent(attachment.url);
 const apiUrl = `https://rapido.zetsu.xyz/api/remove-background?imageUrl=${imageUrl}`;

 const processing = await api.sendMessage("🖼️ | 𝐑𝐞𝐦𝐨𝐯𝐢𝐧𝐠 𝐛𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧d...", event.threadID);
 const processingMsgId = processing.messageID;

 const res = await axios.get(apiUrl);
 const resultUrl = res.data?.result;

 if (!resultUrl) {
 return api.sendMessage("❌ | 𝐁𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧d 𝐫𝐞𝐦𝐨𝐯𝐚𝐥 𝐟𝐚𝐢𝐥𝐞d.", event.threadID, () => {
 if (processingMsgId) api.unsendMessage(processingMsgId);
 });
 }

 const filePath = path.join(__dirname, 'cache', `removed_${Date.now()}.png`);
 await image({ url: resultUrl, dest: filePath });

 return api.sendMessage({
 body: "✅ | 𝐁𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧d 𝐫𝐞𝐦𝐨𝐯𝐞d 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!",
 attachment: fs.createReadStream(filePath)
 }, event.threadID, () => {
 fs.unlinkSync(filePath);
 if (processingMsgId) api.unsendMessage(processingMsgId);
 });

 } catch (err) {
 return api.sendMessage("🚨 | 𝐒𝐞𝐫𝐯𝐞𝐫 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞d d𝐮𝐫𝐢𝐧𝐠 𝐛𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧d 𝐫𝐞𝐦𝐨𝐯𝐚𝐥.", event.threadID, event.messageID);
 }
};
