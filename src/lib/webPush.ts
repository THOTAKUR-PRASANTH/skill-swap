import webPush from "web-push";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  console.error(
    "VAPID keys are not defined. Please run 'npx web-push generate-vapid-keys' and add them to your .env.local file."
  );
} else {
  webPush.setVapidDetails(
    "mailto:tprashanth312@gmail.com", 
    vapidPublicKey,
    vapidPrivateKey
  );
}

export { webPush };
