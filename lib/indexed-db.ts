// IndexedDB utilities for storing card images
const DB_NAME = "MTGCardGenerator"
const DB_VERSION = 1
const STORE_NAME = "cardImages"

interface ImageData {
  id: string
  blob: Blob
  type: string
  name: string
}

class IndexedDBManager {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" })
        }
      }
    })
  }

  async saveImage(id: string, file: File): Promise<string> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)

      const imageData: ImageData = {
        id,
        blob: file,
        type: file.type,
        name: file.name,
      }

      const request = store.put(imageData)

      request.onsuccess = () => {
        // Return a custom URL that we can use to identify this image
        resolve(`indexeddb://${id}`)
      }

      request.onerror = () => reject(request.error)
    })
  }

  async getImage(id: string): Promise<string | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => {
        if (request.result) {
          const imageData: ImageData = request.result
          const url = URL.createObjectURL(imageData.blob)
          resolve(url)
        } else {
          resolve(null)
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  async deleteImage(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getAllImageIds(): Promise<string[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAllKeys()

      request.onsuccess = () => {
        resolve(request.result as string[])
      }

      request.onerror = () => reject(request.error)
    })
  }
}

export const imageDB = new IndexedDBManager()
