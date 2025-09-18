export const waitUntilWithRefresh = async (
  checkFn: () => boolean,
  refreshFn: () => Promise<void>,
  timeout = 5000,
  interval = 100
): Promise<boolean> => {
  const start = Date.now();

  // Jika sudah siap (misal token sudah ada), tidak perlu refresh
  if (checkFn()) return true;

  // Jika belum, panggil refresh sekali
  await refreshFn();

  // Cek berkala hingga timeout
  while (Date.now() - start < timeout) {
    if (checkFn()) return true;
    await new Promise((r) => setTimeout(r, interval));
  }

  return false; // Gagal setelah timeout
};

export const waitUntil = async (
  checkFn: () => boolean,
  timeout = 5000,
  interval = 100
): Promise<boolean> => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (checkFn()) return true;
    await new Promise((r) => setTimeout(r, interval));
  }
  return false;
};

export function getTimeLeft(expiryTime: Date): string {
  const now = new Date();
  const diff = Math.max(0, expiryTime.getTime() - now.getTime());

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}
