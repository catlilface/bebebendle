"use client";

import type { Scran } from "@/types/scran";
import { getLikesPercentage } from "@/lib/scoring";

interface ScranRowProps {
  scran: Scran;
  onApprove: (id: number) => void;
  onBan: (id: number) => void;
}

export function ScranRow({ scran, onApprove, onBan }: ScranRowProps) {
  const percentage = getLikesPercentage({
    numberOfLikes: scran.numberOfLikes,
    numberOfDislikes: scran.numberOfDislikes,
  });

  return (
    <tr className="hover:bg-zinc-800/50">
      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
        {scran.id}
      </td>
      <td className="px-6 py-4">
        {scran.imageUrl && (
          <img
            src={scran.imageUrl}
            alt={scran.name}
            className="h-12 w-12 rounded-none border-2 border-black object-cover"
          />
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-bold text-white">{scran.name}</div>
        {scran.description && (
          <div className="text-xs text-zinc-400 line-clamp-1">
            {scran.description}
          </div>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
        {scran.price.toFixed(2)} ₽
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
        👍 {scran.numberOfLikes}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
        👎 {scran.numberOfDislikes}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-12 overflow-hidden rounded-none border border-zinc-600 bg-zinc-700">
            <div
              className="h-full bg-green-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-white">{percentage}%</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={`inline-flex rounded-none px-2 py-1 text-xs font-bold ${
            scran.approved
              ? "bg-green-500 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {scran.approved ? "Approved" : "Pending"}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex gap-2">
          {!scran.approved && (
            <button
              onClick={() => onApprove(scran.id)}
              className="pixel-btn bg-green-500 px-3 py-1 text-sm font-bold text-white hover:bg-green-600"
            >
              Approve
            </button>
          )}
          {scran.approved && (
            <button
              onClick={() => onBan(scran.id)}
              className="pixel-btn bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
            >
              Ban
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
