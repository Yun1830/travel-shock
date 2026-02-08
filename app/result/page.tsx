"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plane, Home, AlertTriangle } from 'lucide-react';
import { Suspense } from 'react'; // 1. 引入 Suspense

// 這裡是你原本的 DATABASE 資料庫 (請保留你之前寫的那一段)
const DATABASE = {
  kenting: { name: "屏東墾丁", pricePerNight: 8500, transport: 3000, abroadTarget: "沖繩", abroadPrice: 3500, flight: 9000 },
  jiaoxi: { name: "宜蘭礁溪", pricePerNight: 12000, transport: 1500, abroadTarget: "日本九州", abroadPrice: 4000, flight: 11000 },
  sunmoonlake: { name: "南投日月潭", pricePerNight: 15000, transport: 2000, abroadTarget: "越南峴港", abroadPrice: 3000, flight: 8000 },
  alishan: { name: "嘉義阿里山", pricePerNight: 9500, transport: 2500, abroadTarget: "韓國釜山", abroadPrice: 2800, flight: 8500 },
  tainan: { name: "台南古都", pricePerNight: 6500, transport: 2700, abroadTarget: "泰國曼谷", abroadPrice: 2000, flight: 9500 }
};

type DestinationKey = keyof typeof DATABASE;

// 2. 把原本的內容拆成一個子組件
function ResultContent() {
  const searchParams = useSearchParams();
  const rawDest = searchParams.get('dest') || 'kenting';
  const days = Number(searchParams.get('days')) || 3;
  const adults = Number(searchParams.get('adults')) || 2;

  const destKey = (DATABASE[rawDest as DestinationKey] ? rawDest : 'kenting') as DestinationKey;
  const data = DATABASE[destKey];

  const totalDomestic = (data.pricePerNight * days) + (data.transport * adults);
  const totalAbroad = (data.flight * adults) + (data.abroadPrice * days);
  const diff = totalAbroad - totalDomestic;
  const isAbroadCheaper = diff < 0;

  return (
    <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 relative">
      {/* 這裡放你原本左邊國旅、右邊出國的 HTML 內容 */}
      {/* ... (為了簡潔，中間 HTML 省略，請直接沿用你之前的卡片代碼) ... */}
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 relative">
          <h2 className="text-2xl font-bold mb-2">{data.name} {days} 晚</h2>
          <div className="text-3xl font-bold text-red-400">NT$ {totalDomestic.toLocaleString()}</div>
      </div>
      <div className="bg-gradient-to-br from-blue-900/50 to-slate-900 border border-blue-500/30 rounded-2xl p-6 relative">
          <h2 className="text-2xl font-bold mb-2">{data.abroadTarget} {days} 晚</h2>
          <div className="text-3xl font-bold text-blue-300">NT$ {totalAbroad.toLocaleString()}</div>
          <div className="mt-4 text-blue-200 font-bold">
            {isAbroadCheaper ? `比國旅省了 NT$ ${Math.abs(diff).toLocaleString()}！` : `價差僅 NT$ ${Math.abs(diff).toLocaleString()}`}
          </div>
      </div>
    </div>
  );
}

// 3. 主頁面：用 Suspense 把子組件包起來
export default function ResultPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8">
        <Link href="/" className="flex items-center text-slate-400">
          <ArrowLeft size={20} className="mr-2" /> 重選
        </Link>
      </div>

      <Suspense fallback={<div className="text-white text-xl">計算中...</div>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}