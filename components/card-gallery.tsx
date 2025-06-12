"use client"

import { useState } from "react"
import type { CardData } from "./card-generator"
import { CardPreview } from "./card-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Copy, Plus, Search, GalleryThumbnailsIcon as Gallery } from "lucide-react"

interface CardGalleryProps {
  cards: CardData[]
  onLoadCard: (card: CardData) => void
  onDeleteCard: (cardId: string) => void
  onDuplicateCard: (card: CardData) => void
  onCreateNew: () => void
}

export function CardGallery({ cards, onLoadCard, onDeleteCard, onDuplicateCard, onCreateNew }: CardGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [colorFilter, setColorFilter] = useState("all")
  const [layoutFilter, setLayoutFilter] = useState("all")

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesColor = colorFilter === "all" || card.color === colorFilter
    const matchesLayout = layoutFilter === "all" || card.layout === layoutFilter

    return matchesSearch && matchesColor && matchesLayout
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getLayoutBadgeColor = (layout: string) => {
    switch (layout) {
      case "standard":
        return "bg-blue-100 text-blue-800"
      case "text-heavy":
        return "bg-green-100 text-green-800"
      case "utility":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Gallery className="mx-auto h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No cards saved yet</h3>
        <p className="text-muted-foreground mb-4">Create your first card to get started!</p>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Card
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and new card button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="colorless">Colorless</SelectItem>
            </SelectContent>
          </Select>

          <Select value={layoutFilter} onValueChange={setLayoutFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Layouts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Layouts</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="text-heavy">Text-Heavy</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Card
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredCards.length} of {cards.length} cards
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => (
          <div key={card.id} className="group relative">
            {/* Card preview */}
            <div className="mb-3 transform transition-transform group-hover:scale-105">
              <CardPreview card={card} />
            </div>

            {/* Card info and actions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm truncate">{card.name}</h3>
                <Badge className={`text-xs ${getLayoutBadgeColor(card.layout)}`}>{card.layout}</Badge>
              </div>

              <p className="text-xs text-gray-500 truncate">{card.type}</p>

              {card.createdAt && <p className="text-xs text-gray-400">Created {formatDate(card.createdAt)}</p>}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => onLoadCard(card)} className="flex-1">
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>

                <Button size="sm" variant="outline" onClick={() => onDuplicateCard(card)}>
                  <Copy className="h-3 w-3" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Card</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{card.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => card.id && onDeleteCard(card.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && cards.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No cards match your current filters.</p>
        </div>
      )}
    </div>
  )
}
