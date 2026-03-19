// 這是一個 Vercel Serverless Function，負責處理 Telegram 的指令
// 請將此檔案放置於 GitHub 倉庫的 api/telegram.js 路徑下

export default async function handler(req, res) {
  // 僅接受 Telegram 的 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  // 如果沒有訊息內容，直接回傳 OK
  if (!message || !message.text) {
    return res.status(200).send('ok');
  }

  const text = message.text.toLowerCase();
  const chatId = message.chat.id;

  // 指令處理邏輯
  if (text === '/start') {
    return res.status(200).json({
      method: 'sendMessage',
      chat_id: chatId,
      text: "✨ 智慧打卡系統已連線！\n\n您現在可以透過網頁端進行打卡，我也會在這裡同步發送通知給您。"
    });
  }

  if (text === '/today' || text === '/status') {
    // 提醒使用者：因為目前是純 GitHub 模式，數據儲存在網頁本地端 (LocalStorage)
    // 機器人後端無法直接抓取瀏覽器內的紀錄
    return res.status(200).json({
      method: 'sendMessage',
      chat_id: chatId,
      text: "ℹ️ 查詢提示：\n目前考勤紀錄儲存在您的「瀏覽器本地端」。\n請開啟打卡網頁，在下方的「最近紀錄」查看完整數據。"
    });
  }

  // 默認回傳 OK 避免 Telegram 持續重發請求
  return res.status(200).send('ok');
}
