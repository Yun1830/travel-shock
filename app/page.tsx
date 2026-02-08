import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-500">
      <h1 className="text-6xl font-bold text-white">
        國旅 vs 出國
      </h1>
      <p className="mt-4 text-2xl text-white">
        輸入你的預算，看看你去墾丁是盤子，還是去沖繩是贏家。
      </p>
    </div>
  );
}
