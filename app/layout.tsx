import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}