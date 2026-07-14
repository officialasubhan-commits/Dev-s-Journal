"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash captured by root-most boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFF8F2] dark:bg-[#0F0E0D] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1E1C18] border border-[#E7D8C9] dark:border-[#2D2820] rounded-3xl p-8 shadow-2xl text-center space-y-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Critical Error!</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
              The application encountered a critical crash and layout elements failed to load.
            </p>
          </div>

          <Button 
            onClick={() => reset()}
            className="bg-orange-500 text-white hover:bg-orange-600 h-11 px-6 rounded-xl font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer w-full"
          >
            <RotateCcw className="w-4 h-4" /> Restart App
          </Button>
        </div>
      </body>
    </html>
  );
}
