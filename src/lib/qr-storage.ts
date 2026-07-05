export interface QRCodeData {
  id: string;
  text: string;
  foreColor: string;
  bgColor: string;
  logoUrl?: string;
  createdAt: number;
  downloadCount: number;
}

export interface AnalyticsData {
  [key: string]: number;
}

const QR_STORAGE_KEY = "qr-codes";
const ANALYTICS_KEY = "qr-analytics";

export const qrStorage = {
  getAll: (): QRCodeData[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(QR_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save: (qrCode: QRCodeData): void => {
    if (typeof window === "undefined") return;
    try {
      const existing = qrStorage.getAll();
      const index = existing.findIndex((item) => item.id === qrCode.id);
      if (index >= 0) {
        existing[index] = qrCode;
      } else {
        existing.push(qrCode);
      }
      localStorage.setItem(QR_STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error("Failed to save QR code:", error);
    }
  },

  delete: (id: string): void => {
    if (typeof window === "undefined") return;
    try {
      const existing = qrStorage.getAll();
      const filtered = existing.filter((item) => item.id !== id);
      localStorage.setItem(QR_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to delete QR code:", error);
    }
  },

  getById: (id: string): QRCodeData | null => {
    if (typeof window === "undefined") return null;
    const all = qrStorage.getAll();
    return all.find((item) => item.id === id) || null;
  },

  incrementDownloadCount: (id: string): void => {
    if (typeof window === "undefined") return;
    const qrCode = qrStorage.getById(id);
    if (qrCode) {
      qrCode.downloadCount += 1;
      qrStorage.save(qrCode);
      analyticsStorage.recordDownload(qrCode.text);
    }
  },
};

export const analyticsStorage = {
  getStats: (): { mostUsed: Array<[string, number]>; totalGenerated: number } => {
    if (typeof window === "undefined") {
      return { mostUsed: [], totalGenerated: 0 };
    }
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      const analytics: AnalyticsData = data ? JSON.parse(data) : {};
      const mostUsed = Object.entries(analytics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      const totalGenerated = Object.values(analytics).reduce(
        (sum, count) => sum + count,
        0
      );
      return { mostUsed, totalGenerated };
    } catch {
      return { mostUsed: [], totalGenerated: 0 };
    }
  },

  recordGeneration: (text: string): void => {
    if (typeof window === "undefined") return;
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      const analytics: AnalyticsData = data ? JSON.parse(data) : {};
      const normalized = text.toLowerCase().trim();
      analytics[normalized] = (analytics[normalized] || 0) + 1;
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error("Failed to record generation:", error);
    }
  },

  recordDownload: (text: string): void => {
    if (typeof window === "undefined") return;
    try {
      const data = localStorage.getItem(ANALYTICS_KEY);
      const analytics: AnalyticsData = data ? JSON.parse(data) : {};
      const normalized = text.toLowerCase().trim();
      analytics[normalized] = (analytics[normalized] || 0) + 0.5;
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error("Failed to record download:", error);
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(ANALYTICS_KEY);
    } catch (error) {
      console.error("Failed to clear analytics:", error);
    }
  },
};
