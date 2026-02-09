import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "國旅憤怒計算機 | Travel Shock Calculator",
  description: "一鍵算出你的國旅盤子指數。輸入預算，看看同樣的錢去日本能當多大的大爺。國旅 vs 出國殘酷比價。",
  metadataBase: new URL('https://www.travel-shock.win'), // 這裡換成你真正的網址
  openGraph: {
    title: "國旅憤怒計算機 | 敢不敢算算看你虧了多少？",
    description: "我在台灣玩三天花的錢，竟然夠去沖繩玩四天？快來看看你的盤子指數。",
    url: 'https://www.travel-shock.win',
    siteName: 'Travel Shock',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "國旅憤怒計算機",
    description: "別再當盤子了，快來算算你的出國潛力。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${inter.className} bg-slate-950 text-white antialiased flex flex-col min-h-screen`}>
        
        {/* 主要內容區 (會自動撐開高度) */}
        <div className="flex-grow">
          {children}
        </div>

        {/* 頁尾區 (免責聲明 + 版權) */}
        <footer className="w-full bg-slate-900 border-t border-slate-800 py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm space-y-2">
            <p>
              © 2026 國旅憤怒計算機 (Travel Shock). All rights reserved.
            </p>
            <p className="text-xs text-slate-600 max-w-2xl mx-auto">
              免責聲明：本站提供的價格資訊僅供參考 (與娛樂)，實際房價與機票價格請以訂房網站即時顯示為主。
              <br />
              本站內容包含合作夥伴連結 (Affiliate Links)，當您透過連結購買時，本站可能會獲得微薄的分潤以維持營運 (還有平復站長的怒氣)，這不會影響您支付的價格。
            </p>
          </div>
        </footer>

      </body>
      <GoogleAnalytics gaId="G-D9ECRZW8PM" />
    </html>
  );
}