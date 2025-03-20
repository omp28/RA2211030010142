"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Social Media Analytics</h1>

      <div className="space-y-4">
        <button
          className="border-2 border-black text-black px-6 py-2 rounded-md"
          onClick={() => router.push("/top-users")}
        >
          View Top Users
        </button>

        <button
          className="border-2 border-black text-black px-6 py-2 rounded-md"
          onClick={() => router.push("/top-posts")}
        >
          View Top Posts
        </button>

        <button
          className="border-2 border-black text-black px-6 py-2 rounded-md"
          onClick={() => router.push("/latest-posts")}
        >
          View Latest Posts
        </button>
      </div>
    </main>
  );
}
