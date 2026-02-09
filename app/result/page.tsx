"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plane, Home, Share2, Check, TrendingDown } from 'lucide-react';
import { Suspense, useState, useEffect } from 'react';

// --- 設定你的分潤 ID ---
const AFFILIATE_CONFIG = {
  KKDAY_MSCID: '23850', 
  KLOOK_AID: '111184',    
};

// --- 出發地機票價格對照表 (依目的地區域調整) ---
const FLIGHT_PRICES: Record<string, Record<string, number>> = {
  // 日本航線
  japan: {
    taipei: 9000,    // 台北 → 日本
    taichung: 10500, // 台中 → 日本 (班次少，較貴)
    tainan: 11000,   // 台南 → 日本 (需轉機或至高雄)
    kaohsiung: 10000 // 高雄 → 日本
  },
  // 韓國航線
  korea: {
    taipei: 8500,
    taichung: 10000,
    tainan: 10500,
    kaohsiung: 9500
  },
  // 泰國航線
  thailand: {
    taipei: 9500,
    taichung: 11000,
    tainan: 11500,
    kaohsiung: 10500
  },
  // 越南航線
  vietnam: {
    taipei: 8000,
    taichung: 9500,
    tainan: 10000,
    kaohsiung: 9000
  },
  // 馬來西亞航線
  malaysia: {
    taipei: 7000,
    taichung: 8500,
    tainan: 9000,
    kaohsiung: 8000
  }
};

// --- 1. 定義保底匯率 (萬一 API 掛點，至少顯示這個，不會一片空白) ---
const FALLBACK_RATES: Record<string, number> = {
  JPY: 0.215,  // 日幣
  KRW: 0.024,  // 韓元
  THB: 0.92,   // 泰銖
  VND: 0.0013, // 越南盾
  MYR: 7.2,    // 馬來西亞林吉特
  USD: 31.5    // 美金
};

// --- 1. 擴充後的超級盤子資料庫 ---
const DATABASE = {
  kenting: { 
    name: "屏東墾丁", pricePerNight: 8500, childExtra: 1500, transport: 3000, 
    abroadTarget: "日本沖繩", abroadPrice: 3500, region: 'japan', currency: 'JPY',
    domesticSearch: "墾丁", 
    abroadSearch: "Okinawa",
    roast: "同樣的錢，你要在墾丁大街吃盤子滷味，還是去沖繩吃和牛？" 
  },
  jiaoxi: { 
    name: "宜蘭礁溪", pricePerNight: 12000, childExtra: 2500, transport: 1500, 
    abroadTarget: "日本九州", abroadPrice: 4000, region: 'japan', currency: 'JPY',
    domesticSearch: "宜蘭+溫泉", 
    abroadSearch: "Kyushu",
    roast: "這溫泉房價比日本大分縣還貴，是洗完會長生不老嗎？" 
  },
  sunmoonlake: { 
    name: "日月潭", pricePerNight: 15000, childExtra: 3000, transport: 2000, 
    abroadTarget: "越南峴港", abroadPrice: 3000, region: 'vietnam', currency: 'VND',
    domesticSearch: "日月潭", 
    abroadSearch: "Da+Nang",
    roast: "日月潭湖景第一排的錢,夠你在峴港五星級海景飯店住一週。" 
  },
  alishan: { 
    name: "阿里山", pricePerNight: 9500, childExtra: 2000, transport: 2500, 
    abroadTarget: "韓國釜山", abroadPrice: 2800, region: 'korea', currency: 'KRW',
    domesticSearch: "阿里山", 
    abroadSearch: "Busan",
    roast: "在山上吸冷空氣還要付一萬塊，不如去釜山吃海鮮塔。" 
  },
  tainan: { 
    name: "台南古都", pricePerNight: 6500, childExtra: 1200, transport: 2700, 
    abroadTarget: "泰國曼谷", abroadPrice: 2000, region: 'thailand', currency: 'THB',
    domesticSearch: "台南", 
    abroadSearch: "Bangkok",
    roast: "台南排隊吃美食是體力活，去曼谷按摩吃泰菜才是真享受。" 
  },
  penghu: {
    name: "澎湖花火節", pricePerNight: 8000, childExtra: 1500, transport: 4000,
    abroadTarget: "日本宮古島", abroadPrice: 3000, region: 'japan', currency: 'JPY',
    domesticSearch: "澎湖", 
    abroadSearch: "Miyakojima",
    roast: "去澎湖三天兩夜的錢，去沖繩離島的海更藍，還不用跟人擠。"
  },
  hualien: {
    name: "花蓮太魯閣", pricePerNight: 9000, childExtra: 1800, transport: 2000,
    abroadTarget: "泰國清邁", abroadPrice: 1500, region: 'thailand', currency: 'THB',
    domesticSearch: "花蓮", 
    abroadSearch: "Chiang+Mai",
    roast: "花蓮連假塞車的時間，拿來飛清邁剛剛好，房價還只要五分之一。"
  },
  xinyi: {
    name: "台北信義區", pricePerNight: 14000, childExtra: 2000, transport: 500,
    abroadTarget: "馬來西亞吉隆坡", abroadPrice: 2500, region: 'malaysia', currency: 'MYR',
    domesticSearch: "台北+飯店", 
    abroadSearch: "Kuala+Lumpur",
    roast: "在信義區住一晚 W Hotel 的錢，在吉隆坡可以住四晚還有找。"
  }
};

type DestinationKey = keyof typeof DATABASE;

// --- 2. 修正後的匯率組件（不死鳥版本）---
function ExchangeRateBadge({ currency }: { currency: string }) {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 只有當 currency 存在時才抓取
    if (!currency) return;

    // 改用更穩定的 API (Open Exchange Rates)
    fetch(`https://open.er-api.com/v6/latest/${currency}`)
      .then(res => res.json())
      .then(data => {
        // 確認有抓到 TWD
        if (data && data.rates && data.rates.TWD) {
          setRate(data.rates.TWD);
        } else {
          // API 回傳了但沒 TWD，用保底值
          console.warn('API 沒給 TWD，使用保底匯率');
          setRate(FALLBACK_RATES[currency] || 0);
        }
      })
      .catch(err => {
        console.error("匯率抓取失敗，切換保底模式", err);
        setRate(FALLBACK_RATES[currency] || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currency]);

  // 如果還在載入，或者真的沒匯率，就暫時顯示載入中
  if (loading || !rate) return (
    <div className="absolute top-4 right-4 bg-slate-800/50 text-slate-500 text-xs px-2 py-1 rounded animate-pulse">
      匯率查詢中...
    </div>
  );

  // 格式化顯示邏輯
  const isSmallCurrency = ['JPY', 'KRW', 'VND'].includes(currency);
  const displayRate = isSmallCurrency ? rate.toFixed(3) : (1/rate).toFixed(2);
  const displayText = isSmallCurrency 
    ? `1 ${currency} ≈ ${displayRate} TWD` 
    : `1 TWD ≈ ${displayRate} ${currency}`;

  return (
    <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded border border-emerald-500/30 flex items-center gap-1 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]">
      <TrendingDown size={12} />
      即時匯率: {displayText}
    </div>
  );
}

// --- 3. 主要內容區塊 ---
function ResultContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  
  const rawDest = searchParams.get('dest') || 'kenting';
  const days = Number(searchParams.get('days')) || 3;
  const adults = Number(searchParams.get('adults')) || 2;
  const children = Number(searchParams.get('children')) || 0;
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const departure = searchParams.get('departure') || 'taipei'; // 讀取出發地

  const data = (DATABASE[rawDest as DestinationKey] || DATABASE.kenting);
  
  // 依出發地取得機票價格
  const flightPrice = FLIGHT_PRICES[data.region]?.[departure] || 9000;
  
  // 出發地名稱對照
  const departureNames: Record<string, string> = {
    taipei: '台北',
    taichung: '台中',
    tainan: '台南',
    kaohsiung: '高雄'
  };

  // 核心計算
  const domesticTotal = (data.pricePerNight * days) + (data.childExtra * children * days) + (data.transport * adults);
  const abroadTotal = (flightPrice * (adults + children * 0.8)) + (data.abroadPrice * days); 
  const diff = abroadTotal - domesticTotal;
  const isAbroadCheaper = diff < 0;

  // 分享邏輯
  const shareText = `【國旅警報】去${data.name}${days}天竟然要 NT$ ${domesticTotal.toLocaleString()}！同樣預算去${data.abroadTarget}只要 NT$ ${abroadTotal.toLocaleString()}。${data.roast}\n\n看你被盤了多少：`;
  
  const handleShare = async () => {
    const shareData = { title: '國旅憤怒計算機', text: shareText, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log('分享取消'); }
    } else {
      navigator.clipboard.writeText(shareText + window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- Deep Link 生成函數 ---
  // 計算結束日期
  const startDate = new Date(dateParam);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const checkInDate = formatDate(startDate);
  const checkOutDate = formatDate(endDate);

  // KKday 連結 (不支援日期參數，僅搜尋關鍵字)
  const getKKdayLink = (keyword: string) => 
    `https://www.kkday.com/zh-tw/product/productlist?keyword=${encodeURIComponent(keyword)}&cid=${AFFILIATE_CONFIG.KKDAY_MSCID}`;

  // KLOOK 搜尋連結 (簡化版，只帶關鍵字和分潤ID)
  const getKlookSearchLink = (keyword: string) => {
    return `https://www.klook.com/zh-TW/search/?query=${encodeURIComponent(keyword)}&aid=${AFFILIATE_CONFIG.KLOOK_AID}`;
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* 比價卡片區 */}
      <div className="grid md:grid-cols-2 gap-8 relative">
        {/* 國內 */}
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 relative">
          <div className="text-red-500 font-bold mb-2">● 國旅盤子模式</div>
          <h2 className="text-3xl font-bold mb-4">{data.name}</h2>
          <div className="space-y-2 text-slate-400">
            <div className="flex justify-between"><span>住宿 ({days}晚)</span><span>${(data.pricePerNight * days).toLocaleString()}</span></div>
            {children > 0 && <div className="flex justify-between text-red-400"><span>兒童佔床加錢</span><span>+${(data.childExtra * children * days).toLocaleString()}</span></div>}
            <div className="flex justify-between"><span>交通 ({adults}人)</span><span>${(data.transport * adults).toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-2 mt-2 text-xl font-bold text-white">
              <span>總計</span><span>NT$ {domesticTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 國外 */}
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 relative">
          <ExchangeRateBadge currency={data.currency} />
          <div className="text-blue-400 font-bold mb-2">● 聰明出國模式</div>
          <h2 className="text-3xl font-bold mb-4">{data.abroadTarget}</h2>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span>機票 ({departureNames[departure]} → {adults + children}人)</span>
              <span>${(flightPrice * (adults + children * 0.8)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between"><span>住宿 ({days}晚)</span><span>${(data.abroadPrice * days).toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-2 mt-2 text-xl font-bold text-white">
              <span>總計</span><span>NT$ {abroadTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-200 text-sm italic">"{data.roast}"</div>
        </div>
      </div>

      {/* 導購按鈕區 (使用 Deep Link) */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="flex flex-col items-center gap-3 w-full">
           <span className="text-blue-400 font-bold text-sm tracking-wider uppercase">🏆 CP值最高方案</span>
           <a 
             href={getKlookSearchLink(data.abroadSearch)} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group"
           >
             <Plane className="group-hover:translate-x-1 transition-transform" /> 
             查 {data.abroadTarget} 行程
           </a>
           <p className="text-xs text-slate-500">
             建議：{checkInDate} 出發，{days} 天 {adults + children} 人
           </p>
        </div>
        <div className="hidden md:block w-px h-16 bg-slate-700"></div>
        <div className="flex flex-col items-center gap-3 w-full">
           <span className="text-slate-500 font-bold text-sm">💸 堅持要當盤子？</span>
           <a 
             href={getKKdayLink(data.domesticSearch)} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-6 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 group"
           >
             <Home className="group-hover:-translate-y-1 transition-transform" /> 搜 {data.name} 行程
           </a>
        </div>
      </div>

      {/* 分享按鈕 */}
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