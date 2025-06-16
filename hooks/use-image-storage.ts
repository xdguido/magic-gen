"use client"

import { useCallback, useEffect, useState } from "react"
import { imageDB } from "@/lib/indexed-db"

export function useImageStorage() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    imageDB
      .init()
      .then(() => {
        setIsInitialized(true)
      })
      .catch(console.error)
  }, [])

  const saveImage = useCallback(
    async (file: File): Promise<string> => {
      if (!isInitialized) {
        throw new Error("IndexedDB not initialized")
      }

      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const indexedDBUrl = await imageDB.saveImage(imageId, file)
      return indexedDBUrl
    },
    [isInitialized],
  )

  const loadImage = useCallback(
    async (imageUrl: string): Promise<string> => {
      if (!isInitialized) {
        throw new Error("IndexedDB not initialized")
      }

      // Check if it's an IndexedDB URL
      if (imageUrl.startsWith("indexeddb://")) {
        const imageId = imageUrl.replace("indexeddb://", "")
        const blobUrl = await imageDB.getImage(imageId)
        return blobUrl || imageUrl
      }

      return imageUrl
    },
    [isInitialized],
  )

  const deleteImage = useCallback(
    async (imageUrl: string): Promise<void> => {
      if (!isInitialized) {
        throw new Error("IndexedDB not initialized")
      }

      if (imageUrl.startsWith("indexeddb://")) {
        const imageId = imageUrl.replace("indexeddb://", "")
        await imageDB.deleteImage(imageId)
      }
    },
    [isInitialized],
  )

  return {
    isInitialized,
    saveImage,
    loadImage,
    deleteImage,
  }
}
