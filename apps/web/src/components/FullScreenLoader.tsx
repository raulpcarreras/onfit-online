"use client";
import React from "react";

type FullScreenLoaderProps = {
  label?: string;
};

export default function FullScreenLoader({
  label = "Cargando...",
}: FullScreenLoaderProps) {
  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-neutral-800 border-t-amber-400 animate-spin" />
        <div className="text-sm text-white">{label}</div>
      </div>
    </div>
  );
}
