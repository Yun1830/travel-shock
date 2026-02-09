"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plane, Home, AlertTriangle, Share2, Check } from 'lucide-react';
import { Suspense, useState } from 'react';


// 替換成你在後台看到的 ID
const AFFILIATE_CONFIG = {
  KKDAY_MSCID: '23850', // 這是 KKday 的推廣碼
  KLOOK_AID: '111184',    // 這是 Klook 的 Affiliate ID
};

// 1. 擴充後的盤子資料庫
const DATABASE = {
  kenting: { 
    name: "屏東墾丁", 
    pricePerNight: 8500, childExtra: 1500, transport: 3000, 
    abroadTarget: "沖繩", abroadPrice: 3500, flight: 9000,
    domesticSearch: "墾丁", // 給 KKday 搜
    abroadSearch: "Okinawa", // 給 Klook 搜
    roast: "同樣的錢，你要在墾丁大街吃盤子滷味，還是去沖繩吃和牛？"
  },
  jiaoxi: { 
    name: "宜蘭礁溪", 
    pricePerNight: 12000, childExtra: 2500, transport: 1500, 
    abroadTarget: "日本九州", abroadPrice: 4000, flight: 11000,
    domesticSearch: "宜蘭+溫泉",
    abroadSearch: "Kyushu",
    roast: "這溫泉房價比日本大分縣還貴，是洗完會長生不老嗎？"
  },
  sunmoonlake: { 
    name: "日月潭", 
    pricePerNight: 15000, childExtra: 3000, transport: 2000, 
    abroadTarget: "越南峴港", abroadPrice: 3000, flight: 8000,
    domesticSearch: "日月潭",
    abroadSearch: "Da+Nang",
    roast: "日月潭湖景第一排的錢，夠你在峴港五星級海景飯店住一週。"
  },  
  alishan: { 
    name: "阿里山", 
    pricePerNight: 9500, childExtra: 2000, transport: 2500, 
    abroadTarget: "韓國釜山", abroadPrice: 2800, flight: 8500, 
    domesticSearch: "阿里山",
    abroadSearch: "Busan",
    roast: "在山上吸冷空氣還要付一萬塊，不如去釜山吃海鮮塔。" 
  },
  tainan: { 
    name: "台南古都", 
    pricePerNight: 6500, childExtra: 1200, transport: 2700, 
    abroadTarget: "泰國曼谷", abroadPrice: 2000, flight: 9500, 
    domesticSearch: "台南",
    abroadSearch: "Bangkok",
    roast: "台南排隊吃美食是體力活，去曼谷按摩吃泰菜才是真享受。" 
  },
  qingjing: { 
    name: "清境農場", 
    pricePerNight: 7500, childExtra: 1500, transport: 2200, 
    abroadTarget: "瑞士少女峰", abroadPrice: 5000, flight: 35000, 
    domesticSearch: "清境農場",
    abroadSearch: "Jungfraujoch",
    roast: "雖然歐洲機票貴，但清境的歐洲感真的是... 只有羊是一樣的。" }
};

type DestinationKey = keyof typeof DATABASE;

function ResultContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  
  const rawDest = searchParams.get('dest') || 'kenting';
  const days = Number(searchParams.get('days')) || 3;
  const adults = Number(searchParams.get('adults')) || 2;
  const children = Number(searchParams.get('children')) || 0;

  const data = (DATABASE[rawDest as DestinationKey] || DATABASE.kenting);

  // 2. 核心邏輯：國旅 vs 出國 加價計算
  const domesticTotal = (data.pricePerNight * days) + (data.childExtra * children * days) + (data.transport * adults);
  const abroadTotal = (data.flight * (adults + children * 0.8)) + (data.abroadPrice * days); // 假設小孩機票 8 折

  const diff = abroadTotal - domesticTotal;
  const isAbroadCheaper = diff < 0;
  const getKKdayLink = (keyword: string) => {
    return `https://www.kkday.com/zh-tw/product/productlist?keyword=${encodeURIComponent(keyword)}&cid=${AFFILIATE_CONFIG.KKDAY_MSCID}`;
  };

  const getKlookLink = (keyword: string) => {
    return `https://www.klook.com/zh-TW/search/result/?query=${encodeURIComponent(keyword)}&aid=${AFFILIATE_CONFIG.KLOOK_AID}`;
  };
  // 3. 分享功能邏輯
  const shareText = `【國旅警報】去${data.name}${days}天竟然要 NT$ ${domesticTotal.toLocaleString()}！同樣預算去${data.abroadTarget}只要 NT$ ${abroadTotal.toLocaleString()}。${data.roast} #國旅憤怒計算機`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="grid md:grid-cols-2 gap-8 relative">
        {/* 國內卡片 */}
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6">
          <div className="text-red-500 font-bold mb-2">● 國旅盤子模式</div>
          <h2 className="text-3xl font-bold mb-4">{data.name}</h2>
          <div className="space-y-2 text-slate-400">
            <div className="flex justify-between"><span>住宿 ({days}晚)</span><span>${(data.pricePerNight * days).toLocaleString()}</span></div>
            {children > 0 && <div className="flex justify-between text-red-400"><span>兒童佔床加錢</span><span>+${(data.childExtra * children * days).toLocaleString()}</span></div>}
            <div className="flex justify-between border-t border-slate-800 pt-2 mt-2 text-xl font-bold text-white">
              <span>總計</span><span>NT$ {domesticTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 國外卡片 */}
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6">
          <div className="text-blue-400 font-bold mb-2">● 聰明出國模式</div>
          <h2 className="text-3xl font-bold mb-4">{data.abroadTarget}</h2>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between"><span>機票 ({adults + children}人)</span><span>${(data.flight * (adults + children * 0.8)).toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-2 mt-2 text-xl font-bold text-white">
              <span>總計</span><span>NT$ {abroadTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-200 text-sm italic">
             "{data.roast}"
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-around gap-6">
        
        {/* 左邊：國外 Klook (主力) */}
        <div className="flex flex-col items-center gap-3 w-full">
           <span className="text-blue-400 font-bold text-sm tracking-wider uppercase">🏆 聰明人的選擇</span>
           <a 
             href={getKlookLink(data.abroadSearch)}
             target="_blank"
             rel="noopener noreferrer"
             className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
           >
             <Plane className="group-hover:translate-x-1 transition-transform" /> 
             查 {data.abroadTarget} 便宜機票/住宿
           </a>
        </div>

        {/* 分隔線 (手機版隱藏) */}
        <div className="hidden md:block w-px h-16 bg-slate-700"></div>

        {/* 右邊：國內 KKday (備案) */}
        <div className="flex flex-col items-center gap-3 w-full">
           <span className="text-slate-500 font-bold text-sm">💸 堅持要當盤子？</span>
           <a 
             href={getKKdayLink(data.domesticSearch)}
             target="_blank"
             rel="noopener noreferrer"
             className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-6 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 group"
           >
             <Home className="group-hover:-translate-y-1 transition-transform" /> 
             搜 {data.name} 還有沒有空房
           </a>
        </div>

      </div>

      {/* 分享按鈕區 */}
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="text-2xl font-bold text-yellow-500 animate-bounce">
          {isAbroadCheaper ? "快訂機票吧，出國還比較便宜！" : `只差 $${Math.abs(diff).toLocaleString()}，不考慮出國嗎？`}
        </div>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all active:scale-95"
        >
          {copied ? <Check size={20} /> : <Share2 size={20} />}
          {copied ? "已複製嘲諷文字" : "分享我的憤怒結果"}
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" /> 重新計算
        </Link>
      </div>
      <Suspense fallback={<div className="text-white text-xl">正在調閱全台飯店房價...</div>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}