"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Calculator, Plane, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  
  // 1. 設定狀態 (State)
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [days, setDays] = useState(3);
  const [destination, setDestination] = useState('kenting');
  const [departure, setDeparture] = useState('taipei'); // 出發地
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // 日期

  const handleSearch = () => {
    // 2. 把所有參數傳送出去
    router.push(`/result?dest=${destination}&days=${days}&adults=${adults}&children=${children}&date=${date}&departure=${departure}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      
      {/* 標題區塊 */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center justify-center p-2 bg-red-500/10 text-red-400 rounded-full text-sm font-medium mb-4 border border-red-500/20">
          <span className="flex items-center gap-1">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            國旅警報系統
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          國旅 <span className="text-red-500">憤怒</span> 計算機
        </h1>
        <p className="text-slate-400 text-lg">
          輸入你的國旅計畫，看看同樣的預算能在國外當多大的大爺。
        </p>
      </div>

      {/* 輸入卡片區塊 */}
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl shadow-red-900/10">
        
        {/* 出發地選擇 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Plane size={16} /> 你的出發地
          </label>
          <select 
            suppressHydrationWarning
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="taipei">台北 (桃園機場)</option>
            <option value="taichung">台中 (清泉崗機場)</option>
            <option value="tainan">台南 (小港機場)</option>
            <option value="kaohsiung">高雄 (小港機場)</option>
          </select>
        </div>

        {/* 地點選擇 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <MapPin size={16} /> 台灣目的地
          </label>
          <select 
            suppressHydrationWarning
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="jiaoxi">宜蘭礁溪 (溫泉季)</option>
            <option value="kenting">屏東墾丁 (大街盤子價)</option>
            <option value="sunmoonlake">日月潭 (湖景第一排)</option>
            <option value="alishan">阿里山 (櫻花季)</option>
            <option value="tainan">台南 (古都連假)</option>
            <option value="penghu">澎湖 (花火節)</option>
            <option value="hualien">花蓮太魯閣</option>
            <option value="xinyi">台北信義區</option>
          </select>
        </div>

        {/* 日期與天數 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Calendar size={16} /> 出發日期
            </label>
            <div className="relative">
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">天數</label>
            <div className="flex items-center h-12 w-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
              <button onClick={() => setDays(Math.max(1, days - 1))} className="h-full px-3 hover:bg-slate-800 hover:text-red-400 transition-colors border-r border-slate-800/50">-</button>
              <span className="flex-1 text-center font-bold text-white flex items-center justify-center h-full">{days} 晚</span>
              <button onClick={() => setDays(days + 1)} className="h-full px-3 hover:bg-slate-800 hover:text-red-400 transition-colors border-l border-slate-800/50">+</button>
            </div>
          </div>
        </div>

        {/* 人數設定 */}
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2"><Users size={16} /> 成人</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700">-</button>
              <span className="w-4 text-center font-bold">{adults}</span>
              <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700">+</button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-400">兒童 (12歲以下)</label>
              <span className="text-xs text-slate-500">影響佔床與機票計算</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700">-</button>
              <span className="w-4 text-center font-bold">{children}</span>
              <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700">+</button>
            </div>
          </div>

          {/* 🔥 這裡就是你遺失的警告！只有當 children > 0 時會出現 */}
          {children > 0 && (
            <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-xs text-red-200 flex gap-2 animate-pulse">
               ⚠️ <b>殘酷事實：</b> 國旅小孩通常要加收 $500-$1500 佔床費，但日本很多飯店 12 歲以下免費喔！
            </div>
          )}
        </div>

        {/* 執行按鈕 */}
        <button onClick={handleSearch} className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg">
          <Calculator size={20} /> 開始比價 (受到傷害) <ArrowRight size={20} />
        </button>

      </div>
      <div className="mt-8 text-slate-600 text-sm flex items-center gap-2"><Plane size={14} /><span>Powered by Travel Shock Engine v1.0</span></div>
    </main>
  );
}