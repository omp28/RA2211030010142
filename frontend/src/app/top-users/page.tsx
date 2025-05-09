"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { TopUser, ApiResponse } from "../../types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TopUsers() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<ApiResponse<TopUser[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?limit=5`,
    fetcher
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Top Users</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error loading data</p>}
      {data && (
        <table className="w-full max-w-2xl">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Rank</th>
              <th className="text-left py-2">User</th>
              <th className="text-right py-2">Posts</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((user, index) => (
              <tr key={user.userId} className="border-b">
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{user.username}</td>
                <td className="py-2 text-right">{user.postCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="mt-6 bg-gray-500 text-white px-6 py-2 rounded-md"
        onClick={() => router.push("/")}
      >
        Back to Home
      </button>
    </main>
  );
}
