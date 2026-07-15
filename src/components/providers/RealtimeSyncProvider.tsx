"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RealtimeSyncProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2";

    if (!pusherKey) {
      console.log("[Pusher Client] NEXT_PUBLIC_PUSHER_KEY not found. Real-time updates disabled.");
      return;
    }

    let channel: any = null;
    let pusher: any = null;

    // Dynamically load pusher-js client-side
    import("pusher-js").then(({ default: Pusher }) => {
      pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
      });

      channel = pusher.subscribe("devs-journal-sync");

      channel.bind("content-updated", () => {
        console.log("[Pusher Client] Content update event received. Refreshing layout...");
        router.refresh();
      });

      channel.bind("notifications-updated", () => {
        console.log("[Pusher Client] Notifications update event received. Dispatching update event...");
        window.dispatchEvent(new Event("notifications-updated"));
      });
    }).catch(err => {
      console.error("[Pusher Client] Failed to load pusher-js:", err);
    });

    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, [router]);

  return <>{children}</>;
}
