async function registerServiceWorker() {
  if (!navigator.serviceWorker) return;
  try {
    await navigator.serviceWorker.register("/service-worker.js");
  } catch (error) {
    console.log("Service worker registration failed:", error);
  }
}

async function startServiceWorker() {
  const vapidPublicKey = document.head
    .querySelector('meta[name="vapid_public_key"]')
    .getAttribute("content");
  await registerServiceWorker();
  if (await requestNotificationPermission()) {
    const subscription = await getPushSubscription(vapidPublicKey);
    await sendSubscriptionToServer(subscription);
  }
}

async function getPushSubscription(vapidPublicKey) {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return null;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey,
  });
  return subscription;
}

async function sendSubscriptionToServer(subscription) {
  return fetch("/notifications/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": document.head
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content"),
    },
    body: JSON.stringify({ worker: subscription.toJSON() }),
  });
}

async function requestNotificationPermission() {
  const permissionResult = await Notification.requestPermission();
  if (Notification.permission === "granted") {
    allowAlert.style.display = "none";
    return true;
  }
}

registerServiceWorker();

const allowButton = document.querySelector("#allow_notifications");
const allowAlert = document.querySelector("#allow_notifications_alert");

if (typeof Notification !== "undefined") {
  if (Notification.permission === "denied") {
    allowAlert.style.display = "none";
    console.log('notifications not supported');
  } else if (Notification.permission === "granted") {
    console.log('notifications allowed');
    startServiceWorker();
    allowAlert.style.display = "none";
  } else {
    allowAlert.style.display = "block";
    console.log('notifiations pending');
  }

  allowButton.addEventListener("click", async () => {
    if (await requestNotificationPermission()) {
      startServiceWorker();
    }
  });
}
