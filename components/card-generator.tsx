"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Edit, GalleryThumbnailsIcon as Gallery, Save } from "lucide-react"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { toPng } from "html-to-image"
import { CardForm } from "./card-form"
import { CardGallery } from "./card-gallery"
import { CardPreview } from "./card-preview"

export type CardData = {
  name: string
  type: string
  color: string
  rulesText: string
  flavorText: string
  image: string
  layout: "standard" | "text-heavy" | "utility"
  font: "default" | "fontarda"
  id?: string
  createdAt?: string
}

const defaultCard: CardData = {
  name: "Mystic Elemental",
  type: "Creature — Elemental",
  color: "blue",
  rulesText: "**Flying**\nWhen this creature enters the battlefield, *draw a card*.",
  flavorText: "It dances between realms, leaving whispers of arcane knowledge in its wake.",
  image: "/placeholder.svg?height=400&width=400",
  layout: "standard",
  font: "default",
}

export function CardGenerator() {
  const [card, setCard] = useState<CardData>(defaultCard)
  const [savedCards, setSavedCards] = useState<CardData[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mtg-cards")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [activeTab, setActiveTab] = useState("editor")

  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleChange = (field: keyof CardData, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (imageUrl: string) => {
    setCard((prev) => ({ ...prev, image: imageUrl }))
  }

  const saveCard = () => {
    const cardToSave = {
      ...card,
      id: card.id || Date.now().toString(),
      createdAt: card.createdAt || new Date().toISOString(),
    }

    const existingIndex = savedCards.findIndex((c) => c.id === cardToSave.id)
    let newSavedCards: CardData[]

    if (existingIndex >= 0) {
      // Update existing card
      newSavedCards = [...savedCards]
      newSavedCards[existingIndex] = cardToSave
      toast({
        title: "Card Updated",
        description: `"${card.name}" has been updated in your collection.`,
      })
    } else {
      // Add new card
      newSavedCards = [...savedCards, cardToSave]
      toast({
        title: "Card Saved",
        description: `"${card.name}" has been saved to your collection.`,
      })
    }

    setSavedCards(newSavedCards)
    localStorage.setItem("mtg-cards", JSON.stringify(newSavedCards))
    setCard(cardToSave)
  }

  const exportCard = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          quality: 0.95,
          pixelRatio: 2,
        })

        // Create download link
        const link = document.createElement("a")
        link.download = `${card.name.replace(/\s+/g, "-").toLowerCase()}.png`
        link.href = dataUrl
        link.click()

        toast({
          title: "Card Exported",
          description: "Your card has been exported as a PNG image.",
        })
      } catch (error) {
        toast({
          title: "Export Failed",
          description: "There was an error exporting your card.",
          variant: "destructive",
        })
      }
    }
  }

  const loadCard = (cardToLoad: CardData) => {
    setCard(cardToLoad)
    setActiveTab("editor")
    toast({
      title: "Card Loaded",
      description: `"${cardToLoad.name}" has been loaded into the editor.`,
    })
  }

  const deleteCard = (cardId: string) => {
    const newSavedCards = savedCards.filter((c) => c.id !== cardId)
    setSavedCards(newSavedCards)
    localStorage.setItem("mtg-cards", JSON.stringify(newSavedCards))

    // If we're currently editing the deleted card, reset to default
    if (card.id === cardId) {
      setCard(defaultCard)
    }
  }

  const duplicateCard = (cardToDuplicate: CardData) => {
    const duplicatedCard = {
      ...cardToDuplicate,
      name: `${cardToDuplicate.name} (Copy)`,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    const newSavedCards = [...savedCards, duplicatedCard]
    setSavedCards(newSavedCards)
    localStorage.setItem("mtg-cards", JSON.stringify(newSavedCards))

    toast({
      title: "Card Duplicated",
      description: `"${duplicatedCard.name}" has been added to your collection.`,
    })
  }

  const createNewCard = () => {
    setCard(defaultCard)
    setActiveTab("editor")
    toast({
      title: "New Card",
      description: "Started creating a new card.",
    })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="editor" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Card Editor
        </TabsTrigger>
        <TabsTrigger value="gallery" className="flex items-center gap-2">
          <Gallery className="h-4 w-4" />
          Gallery ({savedCards.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="editor" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CardForm card={card} onChange={handleChange} onImageUpload={handleImageUpload} />
            <div className="flex gap-4 mt-6">
              <Button onClick={saveCard} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {card.id ? "Update Card" : "Save Card"}
              </Button>
              <Button onClick={exportCard} className="flex-1">
                <Download className="mr-2 h-4 w-4" /> Export as Image
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <CardPreview ref={cardRef} card={card} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="gallery" className="mt-6">
        <CardGallery
          cards={savedCards}
          onLoadCard={loadCard}
          onDeleteCard={deleteCard}
          onDuplicateCard={duplicateCard}
          onCreateNew={createNewCard}
        />
      </TabsContent>
    </Tabs>
  )
}
