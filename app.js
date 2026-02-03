const ENABLE_LABEL = "Đã bật nhắc hẹn.";
const DISABLE_LABEL = "Chưa kích hoạt.";
const INTERVAL_MS = 30 * 60 * 1000;

const statusEl = document.getElementById("status");
const nextEl = document.getElementById("next");
const enableBtn = document.getElementById("enable");
const stopBtn = document.getElementById("stop");

let timerId = null;
let nextTime = null;

const formatTime = (date) =>
  date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const updateNextTime = () => {
  if (!nextTime) {
    nextEl.textContent = "--";
    return;
  }
  nextEl.textContent = formatTime(nextTime);
};

const sendReminder = () => {
  const message = "Đã đến lúc nghỉ ngơi hoặc chuyển việc nhé!";
  if (Notification.permission === "granted") {
    new Notification("Nhắc hẹn 30 phút", { body: message });
  }
  alert(message);
};

const scheduleNext = () => {
  nextTime = new Date(Date.now() + INTERVAL_MS);
  updateNextTime();
};

const startReminders = () => {
  if (timerId) return;

  statusEl.textContent = ENABLE_LABEL;
  enableBtn.disabled = true;
  stopBtn.disabled = false;

  scheduleNext();
  sendReminder();

  timerId = setInterval(() => {
    sendReminder();
    scheduleNext();
  }, INTERVAL_MS);
};

const stopReminders = () => {
  if (!timerId) return;

  clearInterval(timerId);
  timerId = null;
  nextTime = null;

  statusEl.textContent = DISABLE_LABEL;
  enableBtn.disabled = false;
  stopBtn.disabled = true;
  updateNextTime();
};

const requestPermission = async () => {
  if (!("Notification" in window)) {
    return;
  }
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

enableBtn.addEventListener("click", async () => {
  await requestPermission();
  startReminders();
});

stopBtn.addEventListener("click", stopReminders);

window.addEventListener("beforeunload", () => {
  if (timerId) {
    clearInterval(timerId);
  }
});
