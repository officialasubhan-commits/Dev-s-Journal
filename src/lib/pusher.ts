import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.PUSHER_CLUSTER || "ap2";

const isConfigured = appId && key && secret;

if (isConfigured) {
  pusherInstance = new Pusher({
    appId: appId!,
    key: key!,
    secret: secret!,
    cluster: cluster!,
    useTLS: true,
  });
} else {
  console.log("[Pusher] Real-time environment variables not configured. Real-time updates will be simulated locally.");
}

export async function triggerRealtimeUpdate(channelName: string, eventName: string, data: any = {}) {
  if (pusherInstance) {
    try {
      await pusherInstance.trigger(channelName, eventName, data);
      console.log(`[Pusher] Dispatched real-time update event "${eventName}" on channel "${channelName}"`);
      return true;
    } catch (err) {
      console.error(`[Pusher] Failed to dispatch real-time update:`, err);
      return false;
    }
  } else {
    console.log(`[Pusher SIMULATION] Real-time event "${eventName}" on channel "${channelName}" with data:`, data);
    return false;
  }
}
