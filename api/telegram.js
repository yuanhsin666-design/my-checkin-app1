import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// 1. 初始化 Firebase
const rawConfig = process.env.FIREBASE_CONFIG;
let db = null;

try {
  if (rawConfig) {
    const firebaseConfig = JSON.parse(rawConfig);
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase 初始化失敗:", e);
}

const appId = 'kawaii-unified-checkin-v4'; 
const STAFF_MEMBERS = [
  { id: 'staff_01', name: '小葵 🌻' },
  { id: 'staff_02', name: '阿健 🛠️' },
  { id: 'staff_03', name: '星星 🌟' },
  { id: 'staff_04', name: '妮妮 🎀' },
  { id: 'staff_05', name: '波波 🐶' },
];

export default async function handler(req, res) {
  // 讓 Vercel 不要因為超時掛掉
  if (req.method !== 'POST') {
    return res.status(200).send('Webhook is running');
  }

  const { message } = req.body;
  if (!message || !message.text) return res.status(200).send('ok');

  const text = message.text.trim().toLowerCase();
  const chatId = message.chat.id;

  // 輔助函數：直接回傳訊息給 Telegram
  const sendText = (msg) => {
    return res.status(200).json({
      method: 'sendMessage',
      chat_id: chatId,
      text: msg,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
  };

  try {
    // 檢查資料庫連線
    if (!db) {
      return sendText("⚠️ <b>環境變數未設定</b>\n請在 Vercel 確認 FIREBASE_CONFIG 是否正確輸入。");
    }

    if (text === '/start') {
      return sendText("✨ <b>連接成功！</b>\n輸入 /today 即可查看今日出勤。");
    }

    if (text === '/today' || text === '/status') {
      // 關鍵：使用跟網頁端一模一樣的日期格式
      const today = new Date();
      const todayKey = today.toDateString(); 
      
      let details = [];
      let counts = { work: 0, late: 0, leave: 0, none: 0 };

      // 遍歷所有員工抓取數據
      for (const staff of STAFF_MEMBERS) {
        const path = `artifacts/${appId}/public/data/records_${staff.id}`;
        const querySnapshot = await getDocs(collection(db, path));
        
        // 尋找當天的紀錄
        const records = querySnapshot.docs.map(d => d.data());
        const todayRec = records.find(r => r.dayKey === todayKey);

        if (todayRec) {
          if (todayRec.label === '上') {
            counts.work++;
            details.push(`✅ ${staff.name}：已簽到 (${todayRec.time})`);
          } else if (todayRec.label === '遲') {
            counts.late++;
            details.push(`⚠️ ${staff.name}：<b>遲到</b> (${todayRec.time})`);
          } else {
            counts.leave++;
            details.push(`💤 ${staff.name}：${todayRec.label}`);
          }
        } else {
          counts.none++;
          details.push(`❓ ${staff.name}：未打卡`);
        }
      }

      const report = [
        `📊 <b>今日出勤報告</b>`,
        `━━━━━━━━━━━━━`,
        `📅 日期：${todayKey}`,
        `📈 統計：${counts.work}上 | ${counts.late}遲 | ${counts.leave}休`,
        ``,
        ...details,
        `━━━━━━━━━━━━━`,
        `🔗 <a href="https://${process.env.VERCEL_URL || 'your-app'}.vercel.app">開啟網頁版</a>`
      ].join('\n');

      return sendText(report);
    }

    // 如果輸入了不認識的指令，回傳提示（幫助除錯）
    return sendText(`收到指令：${text}\n但我只認識 /today 哦！`);

  } catch (error) {
    console.error("Bot Error:", error);
    return sendText(`❌ <b>系統發生錯誤</b>\n錯誤訊息：${error.message}`);
  }
}
