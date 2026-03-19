// 這是後端轉接站，請確保在 GitHub 倉庫的 api/telegram.js 中

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  if (!message || !message.text) return res.status(200).send('ok');

  const text = message.text.toLowerCase();
  const chatId = message.chat.id;

  // 使用指令回應
  if (text === '/start') {
    return res.status(200).json({
      method: 'sendMessage',
      chat_id: chatId,
      text: "🤖 機器人連線成功！\n\n您的 Token 已更新為正確的機器人帳戶。\n現在請至網頁端進行測試。"
    });
  }

  if (text === '/today' || text === '/status') {
    return res.status(200).json({
      method: 'sendMessage',
      chat_id: chatId,
      text: "ℹ️ 紀錄查詢提示：\n目前資料儲存在您的瀏覽器中，請直接查看打卡網頁下方的紀錄區。"
    });
  }

  return res.status(200).send('ok');
}
