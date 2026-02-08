"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plane, Home, AlertTriangle } from 'lucide-react';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('dest') || '墾丁';
  const days = Number(searchParams.get('days')) || 3;
  const adults = Number(searchParams.get('adults')) || 2;

  // --- 這裡是為了 Demo 先寫死的假邏輯 (之後會換成真 API) ---
  // 假設國旅平均一晚房價 (連假盤子價)
  const domesticPricePerNight = 8500; 
  // 假設國內交通 (高鐵+租車)
  const domesticTransport = 3000 * adults;
  
  // 計算國旅總花費
  const totalDomestic = (domesticPricePerNight * days) + domesticTransport;

  // 對照組：沖繩
  // 假設沖繩機票
  const flightPrice = 9000;
  // 假設沖繩住宿 (CP值高)
  const abroadPricePerNight = 3500;
  
  // 計算出國總花費
  const totalAbroad = (flightPrice * adults) + (abroadPricePerNight * days);
  
  // 價差 (正數代表出國比較貴，負數代表出國比較便宜)
  const diff = totalAbroad - totalDomestic;
  const isAbroadCheaper = diff < 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      
      {/* 頂部導覽 */}
      <div className="w-full max-w-4xl mb-8 flex items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" /> 重選
        </Link>
      </div>

      {/* 核心比價卡片 (左右對決) */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 relative">
        
        {/* 左邊：國旅 (Pain) */}
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-red-600 text-xs font-bold px-3 py-1 rounded-bl-lg">
            盤子警報
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2 flex items-center gap-2">
            <Home className="text-red-500" /> 
            {destination} {days} 晚
          </h2>
          <div className="space-y-4 my-6">
            <div className="flex justify-between text-slate-400">
              <span>住宿 ({days}晚)</span>
              <span>NT$ {(domesticPricePerNight * days).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>交通 (估算)</span>
              <span>NT$ {domesticTransport.toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-800 my-2"></div>
            <div className="flex justify-between text-3xl font-bold text-red-400">
              <span>總花費</span>
              <span>NT$ {totalDomestic.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            * 包含 {adults} 位成人的高鐵/租車預估。住宿以連假平均房價計算。
          </p>
        </div>

        {/* VS 圖示 */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 rounded-full items-center justify-center border-4 border-slate-950 z-10 font-black italic text-xl text-yellow-500">
          VS
        </div>

        {/* 右邊：出國 (Gain) */}
        <div className="bg-gradient-to-br from-blue-900/50 to-slate-900 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">
            贏家選擇
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Plane className="text-blue-400" /> 
            日本沖繩 {days} 晚
          </h2>
           <div className="space-y-4 my-6">
            <div className="flex justify-between text-slate-300">
              <span>住宿 ({days}晚)</span>
              <span>NT$ {(abroadPricePerNight * days).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>機票 ({adults}人)</span>
              <span>NT$ {(flightPrice * adults).toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-700 my-2"></div>
            <div className="flex justify-between text-3xl font-bold text-blue-300">
              <span>總花費</span>
              <span>NT$ {totalAbroad.toLocaleString()}</span>
            </div>
          </div>
          
          {/* 結論區塊 */}
          <div className="mt-6 bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
             <div className="flex items-start gap-3">
               <AlertTriangle className="text-yellow-400 shrink-0" />
               <div>
                 <p className="font-bold text-blue-200 text-lg mb-1">
                   {isAbroadCheaper 
                     ? `出國還省了 NT$ ${Math.abs(diff).toLocaleString()}！` 
                     : `只差 NT$ ${Math.abs(diff).toLocaleString()} 就能出國！`}
                 </p>
                 <p className="text-sm text-blue-300/80">
                   同樣的錢，你要在墾丁吃滷味，還是去沖繩吃和牛？
                 </p>
               </div>
             </div>
          </div>
        </div>

      </div>
      
      {/* CTA 按鈕 */}
      <div className="mt-12 flex gap-4">
         <button className="bg-white text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-slate-200 transition-colors">
            查看沖繩機票
         </button>
         <button className="bg-transparent border border-slate-600 text-slate-300 font-bold py-3 px-8 rounded-full hover:bg-slate-800 transition-colors">
            截圖分享 (讓朋友生氣)
         </button>
      </div>

    </main>
  );
}