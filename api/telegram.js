<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KAWAII SYSTEM - 雲端考勤管理</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&display=swap');
        
        body {
            background-color: #fff5f7;
            font-family: 'Noto Sans TC', sans-serif;
            color: #4a4a4a;
        }

        .glass-panel {
            background: white;
            border-radius: 30px;
            box-shadow: 0 10px 30px rgba(255, 182, 193, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .member-btn {
            transition: all 0.3s;
            border: 1px solid #f0f0f0;
        }

        .member-btn.active {
            background: linear-gradient(135deg, #ff6b8b, #ff85a2);
            color: white !important;
            border-color: #ff5c81;
            box-shadow: 0 8px 15px rgba(255, 107, 139, 0.3);
        }

        .custom-scroll::-webkit-scrollbar {
            height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: #ffb6c1;
            border-radius: 10px;
        }

        .status-dot {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 900;
            color: white;
        }
    </style>
</head>
<body class="p-6">

    <div class="max-w-6xl mx-auto space-y-6">
        <header class="glass-panel p-6 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <div id="status-icon" class="w-14 h-14 bg-gray-200 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md transition-colors">
                    ?
                </div>
                <div>
                    <h1 class="text-2xl font-black text-[#ff4d7d] tracking-tighter italic">KAWAII SYSTEM</h1>
                    <p class="text-xs font-bold text-gray-400">連線狀態：<span id="sync-status" class="text-amber-500 font-black">正在初始化...</span></p>
                </div>
            </div>
            <div class="text-right">
                <p id="clock" class="text-3xl font-black text-gray-700 leading-none tabular-nums">00:00:00</p>
                <p id="current-date" class="text-[10px] font-bold text-rose-300 uppercase mt-2">LOADING DATE...</p>
            </div>
        </header>

        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 md:col-span-3 glass-panel p-6">
                <p class="text-[10px] font-black text-rose-200 uppercase tracking-widest mb-4">MEMBER PANEL</p>
                <div id="staff-list" class="space-y-3"></div>
            </div>

            <div class="col-span-12 md:col-span-6 glass-panel p-10 flex flex-col items-center justify-center relative overflow-hidden group">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-300 via-rose-300 to-blue-300"></div>
                <p class="text-[10px] font-black text-rose-200 uppercase tracking-widest mb-10">INSTANT CHECK-IN</p>
                <button id="btn-main-checkin" disabled class="bg-gray-200 w-full max-w-[280px] aspect-[16/10] rounded-[3rem] shadow-lg flex flex-col items-center justify-center text-white gap-2 relative z-10 cursor-not-allowed">
                    <span id="checkin-text" class="text-4xl font-black tracking-tighter">連線中...</span>
                </button>
            </div>

            <div class="col-span-12 md:col-span-3 glass-panel p-6">
                <p class="text-[10px] font-black text-rose-200 uppercase tracking-widest mb-4">EXTRA OPTIONS</p>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="handleCheckIn('WORK', '遲')" class="p-4 bg-red-50 text-red-400 rounded-2xl font-black hover:bg-red-100 transition-colors">遲</button>
                    <button onclick="handleCheckIn('LEAVE', '休')" class="p-4 bg-blue-50 text-blue-500 rounded-2xl font-black hover:bg-blue-100 transition-colors">休</button>
                    <button onclick="handleCheckIn('LEAVE', '事')" class="p-4 bg-orange-50 text-orange-500 rounded-2xl font-black hover:bg-orange-100 transition-colors">事</button>
                    <button onclick="handleCheckIn('LEAVE', '病')" class="p-4 bg-rose-50 text-rose-500 rounded-2xl font-black hover:bg-rose-100 transition-colors">病</button>
                    <button onclick="handleCheckIn('OTHER', '特')" class="p-4 bg-purple-50 text-purple-500 rounded-2xl font-black hover:bg-purple-100 transition-colors">特</button>
                    <button onclick="handleCheckIn('OTHER', '加')" class="p-4 bg-emerald-50 text-emerald-500 rounded-2xl font-black hover:bg-emerald-100 transition-colors">加</button>
                </div>
            </div>
        </div>

        <div class="glass-panel p-8">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-xl font-black text-gray-700 italic">三月份考勤彙整 (模擬數據)</h2>
                    <p class="text-[10px] font-bold text-rose-300">狀態：已自動補齊 3/1 至今日之「上班」紀錄（排除假別後）</p>
                </div>
            </div>
            <div class="overflow-x-auto custom-scroll">
                <table class="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr class="text-[10px] font-black text-rose-200 uppercase">
                            <th class="p-4 w-24">Staff</th>
                            <script>
                                for(let i=1; i<=31; i++) {
                                    document.write(`<th class="p-2 text-center border-l border-rose-50/50">${i}</th>`);
                                }
                            </script>
                        </tr>
                    </thead>
                    <tbody id="attendance-body"></tbody>
                </table>
            </div>
        </div>

        <div id="status-toast" class="fixed bottom-10 right-10 bg-white shadow-2xl rounded-2xl p-4 border-l-4 border-rose-400 transform translate-y-32 transition-transform duration-500 flex items-center gap-3 z-50">
            <div id="toast-icon" class="w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 text-sm">✨</div>
            <div class="text-sm font-bold text-gray-600" id="toast-msg">系統就緒</div>
        </div>
    </div>

    <script type="importmap">
        {
          "imports": {
            "firebase/app": "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js",
            "firebase/auth": "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js",
            "firebase/firestore": "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"
          }
        }
    </script>

    <script type="module">
        import { initializeApp } from "firebase/app";
        import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
        import { getFirestore, doc, setDoc, onSnapshot, collection, serverTimestamp } from "firebase/firestore";

        const firebaseConfig = {
            apiKey: "AIzaSyCklhV_IZpDuH6NuGNFVPfuVzVcMC2sd_w",
            authDomain: "my-checkin-app1.firebaseapp.com",
            projectId: "my-checkin-app1",
            storageBucket: "my-checkin-app1.firebasestorage.app",
            messagingSenderId: "844504622971",
            appId: "1:844504622971:web:e779f4fb2a67f24797ffde"
        };

        const appId = 'kawaii-unified-checkin-v4';
        const STAFF_MEMBERS = [
            { id: 'staff_01', name: '小葵 🌻' },
            { id: 'staff_02', name: '阿健 🛠️' },
            { id: 'staff_03', name: '星星 🌟' },
            { id: 'staff_04', name: '妮妮 🎀' },
            { id: 'staff_05', name: '波波 🐶' }
        ];

        let db, auth, user;
        let currentStaff = STAFF_MEMBERS[0];

        async function init() {
            updateDateUI();
            renderStaffList();
            renderEmptyTable();
            prePopulateHolidays();

            try {
                const app = initializeApp(firebaseConfig);
                auth = getAuth(app);
                db = getFirestore(app);
                signInAnonymously(auth);
                onAuthStateChanged(auth, (u) => {
                    user = u;
                    if (user) {
                        setConnected(true);
                        startListeners();
                    }
                });
            } catch (err) {
                setConnected(false, "初始化錯誤");
            }
        }

        function setConnected(connected, customMsg) {
            const statusEl = document.getElementById('sync-status');
            const iconEl = document.getElementById('status-icon');
            const btnMain = document.getElementById('btn-main-checkin');
            const btnText = document.getElementById('checkin-text');

            if (connected) {
                statusEl.innerText = "● 已連線至雲端 (my-checkin-app1)";
                statusEl.className = "text-emerald-500 font-black";
                iconEl.className = "w-14 h-14 bg-rose-400 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg";
                iconEl.innerText = "小";
                btnMain.className = "bg-emerald-400 hover:bg-emerald-500 active:scale-95 w-full max-w-[280px] aspect-[16/10] rounded-[3rem] shadow-lg flex flex-col items-center justify-center text-white gap-2 cursor-pointer transition-all";
                btnMain.disabled = false;
                btnText.innerText = "即刻簽到";
            } else {
                statusEl.innerText = customMsg || "× 連線失敗";
                statusEl.className = "text-red-500 font-black";
                btnText.innerText = "重新載入中";
            }
        }

        function renderStaffList() {
            const list = document.getElementById('staff-list');
            STAFF_MEMBERS.forEach((staff, index) => {
                const btn = document.createElement('button');
                btn.id = `btn-staff-${staff.id}`;
                btn.className = `member-btn w-full p-4 rounded-2xl flex justify-between items-center font-bold transition-all ${index === 0 ? 'active' : 'bg-rose-50/30 text-slate-400'}`;
                btn.innerHTML = `<span>${staff.name}</span>`;
                btn.onclick = () => {
                    document.querySelectorAll('.member-btn').forEach(b => {
                        b.classList.remove('active');
                        b.classList.add('bg-rose-50/30', 'text-slate-400');
                    });
                    btn.classList.add('active');
                    btn.classList.remove('bg-rose-50/30', 'text-slate-400');
                    currentStaff = staff;
                };
                list.appendChild(btn);
            });
        }

        function renderEmptyTable() {
            const tbody = document.getElementById('attendance-body');
            tbody.innerHTML = "";
            STAFF_MEMBERS.forEach(staff => {
                const tr = document.createElement('tr');
                tr.className = "border-t border-rose-50/50";
                let html = `<td class="p-4 font-black text-sm text-slate-500">${staff.name.split(' ')[0]}</td>`;
                for(let i=1; i<=31; i++) {
                    html += `<td class="p-1 border-l border-rose-50/50 text-center"><div id="cell-${staff.id}-${i}" class="w-1.5 h-1.5 rounded-full bg-rose-50 mx-auto transition-all duration-500"></div></td>`;
                }
                tr.innerHTML = html;
                tbody.appendChild(tr);
            });
        }

        function prePopulateHolidays() {
            const todayDate = new Date().getDate(); // 獲取今日日期 (3/20)

            // 1. 每人基本 7 天休假
            STAFF_MEMBERS.forEach(staff => {
                let holidayCount = 0;
                while(holidayCount < 7) {
                    let day = Math.floor(Math.random() * 31) + 1;
                    const cell = document.getElementById(`cell-${staff.id}-${day}`);
                    if (cell && cell.innerText === "") {
                        updateCellUI(staff.id, day, "休");
                        holidayCount++;
                    }
                }

                // 2. 小葵與阿健 額外 1-2 天特休 (特)
                if (staff.id === 'staff_01' || staff.id === 'staff_02') {
                    let specialCount = 0;
                    let targetSpecial = Math.floor(Math.random() * 2) + 1;
                    while(specialCount < targetSpecial) {
                        let day = Math.floor(Math.random() * 31) + 1;
                        const cell = document.getElementById(`cell-${staff.id}-${day}`);
                        if (cell && cell.innerText === "") {
                            updateCellUI(staff.id, day, "特");
                            specialCount++;
                        }
                    }
                }
            });

            // 3. 隨機選出三個人，每人隨機一天遲到 (遲)
            const randomStaffs = [...STAFF_MEMBERS].sort(() => 0.5 - Math.random()).slice(0, 3);
            randomStaffs.forEach(staff => {
                let found = false;
                let attempts = 0;
                while(!found && attempts < 50) {
                    let day = Math.floor(Math.random() * 31) + 1;
                    const cell = document.getElementById(`cell-${staff.id}-${day}`);
                    if (cell && cell.innerText === "") {
                        updateCellUI(staff.id, day, "遲");
                        found = true;
                    }
                    attempts++;
                }
            });

            // 4. 【新功能】補齊從 3/1 到 今日(3/20) 的上班打卡紀錄 (排除已排假的日子)
            STAFF_MEMBERS.forEach(staff => {
                for(let d = 1; d <= todayDate; d++) {
                    const cell = document.getElementById(`cell-${staff.id}-${d}`);
                    // 如果這天還沒有任何紀錄（不是休、特、遲），就自動標記為「上」
                    if (cell && cell.innerText === "") {
                        updateCellUI(staff.id, d, "上");
                    }
                }
            });
        }

        function startListeners() {
            STAFF_MEMBERS.forEach(staff => {
                const colPath = `artifacts/${appId}/public/data/records_${staff.id}`;
                onSnapshot(collection(db, colPath), (snapshot) => {
                    snapshot.docs.forEach(doc => {
                        const data = doc.data();
                        const recordDate = new Date(data.dayKey);
                        if (recordDate.getMonth() === new Date().getMonth()) {
                            updateCellUI(staff.id, recordDate.getDate(), data.label);
                        }
                    });
                }, (err) => console.log("Listen error:", err));
            });
        }

        function updateCellUI(staffId, day, label) {
            const cell = document.getElementById(`cell-${staffId}-${day}`);
            if (!cell) return;
            
            let color = "bg-emerald-400"; // 上
            if (label === '遲') color = "bg-red-400";
            else if (['休', '事', '病'].includes(label)) color = "bg-blue-400";
            else if (label === '特') color = "bg-purple-500";
            else if (label === '加') color = "bg-emerald-600";

            cell.className = `status-dot ${color} shadow-sm mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white font-bold animate-in fade-in zoom-in duration-300`;
            cell.innerText = label;
        }

        window.handleCheckIn = async (type, label) => {
            if (!user) return showToast("連線未就緒", true);
            showToast("正在同步至雲端...");
            const today = new Date();
            const todayKey = today.toDateString();
            const docId = `${todayKey.replace(/\s+/g, '-')}_${currentStaff.id}`;
            try {
                const colPath = `artifacts/${appId}/public/data/records_${currentStaff.id}`;
                await setDoc(doc(db, colPath, docId), {
                    staffId: currentStaff.id, name: currentStaff.name,
                    type, label, time: today.toLocaleTimeString('zh-TW', { hour12: false }),
                    dayKey: todayKey, timestamp: serverTimestamp()
                });
                showToast(`✨ ${currentStaff.name} 打卡成功 (${label})`);
            } catch (err) {
                showToast("雲端儲存失敗: " + err.code, true);
            }
        };

        document.getElementById('btn-main-checkin').onclick = () => window.handleCheckIn('WORK', '上');

        function updateDateUI() {
            const now = new Date();
            document.getElementById('current-date').innerText = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }

        function showToast(msg, isError = false) {
            const toast = document.getElementById('status-toast');
            const msgEl = document.getElementById('toast-msg');
            const iconEl = document.getElementById('toast-icon');
            msgEl.innerText = msg;
            toast.className = `fixed bottom-10 right-10 bg-white shadow-2xl rounded-2xl p-4 border-l-4 transition-all duration-500 z-50 flex items-center gap-3 ${isError ? 'border-red-400' : 'border-rose-400'}`;
            iconEl.innerText = isError ? "✕" : "✨";
            toast.classList.remove('translate-y-32');
            setTimeout(() => toast.classList.add('translate-y-32'), 4000);
        }

        setInterval(() => {
            document.getElementById('clock').innerText = new Date().toLocaleTimeString('zh-TW', { hour12: false });
        }, 1000);

        init();
    </script>
</body>
</html>
