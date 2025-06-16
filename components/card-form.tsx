"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import type React from "react"
import { useState, useCallback } from "react"
import type { CardData } from "./card-generator"
import { useImageStorage } from "@/hooks/use-image-storage"
import { useToast } from "@/hooks/use-toast"

interface CardFormProps {
  card: CardData
  onChange: (field: keyof CardData, value: string) => void
  onImageUpload: (imageUrl: string) => void
}

export function CardForm({ card, onChange, onImageUpload }: CardFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { saveImage, isInitialized } = useImageStorage()
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      await processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setIsUploading(true)
    setImageFile(file)

    try {
      if (isInitialized) {
        // Save to IndexedDB and get the IndexedDB URL
        const indexedDBUrl = await saveImage(file)
        onImageUpload(indexedDBUrl)
      } else {
        // Fallback to blob URL if IndexedDB is not ready
        const imageUrl = URL.createObjectURL(file)
        onImageUpload(imageUrl)
      }
    } catch (error) {
      console.error("Error saving image:", error)
      toast({
        title: "Image Upload Error",
        description: "Failed to save image. Using temporary preview.",
        variant: "destructive",
      })
      // Fallback to blob URL
      const imageUrl = URL.createObjectURL(file)
      onImageUpload(imageUrl)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFile = useCallback(
    async (file: File) => {
      if (file && file.type.startsWith("image/")) {
        await processFile(file)
      }
    },
    [isInitialized, saveImage, onImageUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find((file) => file.type.startsWith("image/"))

      if (imageFile) {
        await handleFile(imageFile)
      }
    },
    [handleFile],
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Card Name</Label>
        <Input
          id="name"
          value={card.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter card name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Card Type (Optional)</Label>
        <Input
          id="type"
          value={card.type}
          onChange={(e) => onChange("type", e.target.value)}
          placeholder="e.g. Creature — Elf, Instant, Sorcery"
        />
      </div>

      <div className="space-y-2">
        <Label>Card Color</Label>
        <RadioGroup
          value={card.color}
          onValueChange={(value) => onChange("color", value)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="white" id="white" />
            <Label htmlFor="white" className="flex items-center">
              <div className="w-4 h-4 bg-amber-50 border border-gray-300 rounded-full mr-2"></div>
              White
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blue" id="blue" />
            <Label htmlFor="blue" className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              Blue
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="black" id="black" />
            <Label htmlFor="black" className="flex items-center">
              <div className="w-4 h-4 bg-gray-800 rounded-full mr-2"></div>
              Black
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="red" id="red" />
            <Label htmlFor="red" className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
              Red
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="purple" id="purple" />
            <Label htmlFor="purple" className="flex items-center">
              <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
              Purple
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="green" id="green" />
            <Label htmlFor="green" className="flex items-center">
              <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
              Green
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gold" id="gold" />
            <Label htmlFor="gold" className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              Gold
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sepia" id="sepia" />
            <Label htmlFor="sepia" className="flex items-center">
              <div className="w-4 h-4 bg-yellow-900 rounded-full mr-2"></div>
              Sepia
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="colorless" id="colorless" />
            <Label htmlFor="colorless" className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
              Colorless
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="texture">Card Texture</Label>
        <Select value={card.texture} onValueChange={(value) => onChange("texture", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select texture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Parchment</SelectItem>
            <SelectItem value="chernobyl">Chernobyl Wasteland</SelectItem>
            <SelectItem value="lava">Lava Rock</SelectItem>
            <SelectItem value="rock">Rock</SelectItem>
            <SelectItem value="oxido">Oxido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Card Layout</Label>
        <RadioGroup
          value={card.layout}
          onValueChange={(value) => onChange("layout", value as "standard" | "text-heavy" | "utility")}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard">Standard Layout</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text-heavy" id="text-heavy" />
            <Label htmlFor="text-heavy">Text-Heavy Layout</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="utility" id="utility" />
            <Label htmlFor="utility">Utility Layout</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="back" id="back" />
            <Label htmlFor="back">Card Back</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          {card.layout === "standard" && "Large image with standard text space"}
          {card.layout === "text-heavy" && "Smaller image with more space for rules text"}
          {card.layout === "utility" && "Compact card with only name and image - perfect for tokens"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rulesText">Rules Text</Label>
        <Textarea
          id="rulesText"
          value={card.rulesText}
          onChange={(e) => onChange("rulesText", e.target.value)}
          placeholder="Enter card rules text (Markdown supported)"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Supports Markdown: **bold**, *italic*, ~~strikethrough~~, `code`, and line breaks
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="flavorText">Flavor Text (Optional)</Label>
        <Textarea
          id="flavorText"
          value={card.flavorText}
          onChange={(e) => onChange("flavorText", e.target.value)}
          placeholder="Enter flavor text"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Card Image</Label>
        <div className="flex items-center gap-4">
          <Label
            htmlFor="image-upload"
            className={`cursor-pointer flex items-center justify-center border-2 border-dashed rounded-lg p-6 w-full transition-all duration-200 ${
              isDragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-gray-300 hover:border-gray-400"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-2">
              <Upload
                className={`h-8 w-8 ${isDragOver ? "text-blue-500" : "text-gray-400"} ${isUploading ? "animate-pulse" : ""}`}
              />
              <div className="text-center">
                <span className={`text-sm font-medium ${isDragOver ? "text-blue-600" : "text-gray-700"}`}>
                  {isUploading
                    ? "Saving image..."
                    : imageFile
                      ? imageFile.name
                      : isDragOver
                        ? "Drop image here"
                        : "Click to upload or drag & drop"}
                </span>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font">Font Style</Label>
        <Select value={card.font} onValueChange={(value) => onChange("font", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eb-garamond">EB Garamond</SelectItem>
            <SelectItem value="amarante">Amarante</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
