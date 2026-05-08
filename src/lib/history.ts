export type HistoryType = 'image' | 'video' | 'qr';

export interface HistoryItem {
  id: string;
  type: HistoryType;
  blob: Blob;
  prompt?: string;
  metadata?: any;
  timestamp: number;
}

const DB_NAME = 'RuangRiungDB';
const DB_VERSION = 1;
const STORE_NAME = 'historyStore';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort by timestamp descending (newest first)
      const items = (request.result as HistoryItem[]).sort((a, b) => b.timestamp - a.timestamp);
      resolve(items);
    };

    request.onerror = () => reject(request.error);
  });
};

export const saveToHistory = async (item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<HistoryItem> => {
  const db = await initDB();
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    timestamp: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(newItem);

    request.onsuccess = async () => {
      // Enforce max 50 items
      const allItems = await getHistory();
      if (allItems.length > 50) {
        const toDelete = allItems.slice(50);
        toDelete.forEach(itemToDelete => {
           removeFromHistory(itemToDelete.id);
        });
      }
      resolve(newItem);
    };

    request.onerror = () => reject(request.error);
  });
};

export const removeFromHistory = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const clearHistory = async (): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
