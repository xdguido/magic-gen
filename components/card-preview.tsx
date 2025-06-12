import type { CardData } from "./card-generator"
import Image from "next/image"
import { forwardRef } from "react"

interface CardPreviewProps {
  card: CardData
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ card }, ref) => {
  // Color mapping for card frames
  const colorStyles: Record<
    string,
    { border: string; tint: string; titleBg: string; textColor: string; opacity: string }
  > = {
    white: {
      border: "border-stone-200",
      tint: "bg-stone-50",
      titleBg: "bg-stone-100",
      textColor: "text-gray-950",
      opacity: "opacity-70",
    },
    blue: {
      border: "border-blue-900",
      tint: "bg-blue-500",
      titleBg: "bg-blue-200",
      textColor: "text-gray-950",
      opacity: "opacity-20",
    },
    black: {
      border: "border-stone-950",
      tint: "bg-gray-800",
      titleBg: "bg-gray-600",
      textColor: "text-gray-950",
      opacity: "opacity-30",
    },
    red: {
      border: "border-red-900",
      tint: "bg-red-500",
      titleBg: "bg-red-300",
      textColor: "text-gray-950",
      opacity: "opacity-20",
    },
    purple: {
      border: "border-purple-900",
      tint: "bg-purple-500",
      titleBg: "bg-purple-300",
      textColor: "text-gray-950",
      opacity: "opacity-20",
    },
    green: {
      border: "border-green-900",
      tint: "bg-green-500",
      titleBg: "bg-green-200",
      textColor: "text-gray-950",
      opacity: "opacity-20",
    },
    gold: {
      border: "border-yellow-900",
      tint: "bg-yellow-400",
      titleBg: "bg-yellow-200",
      textColor: "text-gray-950",
      opacity: "opacity-30",
    },
    colorless: {
      border: "border-gray-500",
      tint: "bg-gray-400",
      titleBg: "bg-gray-200",
      textColor: "text-gray-950",
      opacity: "opacity-10",
    },
  }

  const styles = colorStyles[card.color] || colorStyles.colorless

  // Utility layout - compact card with only name and image
  if (card.layout === "utility") {
    return (
      <div className="bg-transparent p-4">
        <div
          ref={ref}
          className={`w-[200px] h-[280px] rounded-[12px] overflow-hidden border-6 ${styles.border} shadow-lg ${styles.textColor} relative bg-white`}
        >
          {/* Texture background with color tint */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
            <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
          </div>

          {/* Card Title with texture background */}
          <div className={`px-2 py-1 border-b border-gray-400 relative z-10 overflow-hidden`}>
            {/* Header texture background */}
            <div className="absolute inset-0 z-0">
              <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
              <div className={`absolute inset-0 ${styles.tint} opacity-40 mix-blend-multiply`}></div>
            </div>
            <h3 className="font-amarante font-bold text-sm text-center mtg-card-title relative z-10">{card.name}</h3>
          </div>

          {/* Card Image - takes up most of the space */}
          <div className="h-[240px] relative z-10 bg-white bg-opacity-70">
            <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" priority />
          </div>
        </div>
      </div>
    )
  }

  // Text-heavy layout
  if (card.layout === "text-heavy") {
    return (
      <div className="bg-transparent p-4">
        <div
          ref={ref}
          className={`w-[300px] h-[420px] rounded-[16px] overflow-hidden border-8 ${styles.border} shadow-lg ${styles.textColor} relative bg-white`}
        >
          {/* Texture background with color tint */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
            <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
          </div>

          {/* Card Title with texture background */}
          <div className={`px-3 py-1 border-b border-gray-400 relative z-10 overflow-hidden`}>
            {/* Header texture background */}
            <div className="absolute inset-0 z-0">
              <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
              <div className={`absolute inset-0 ${styles.tint} opacity-40 mix-blend-multiply`}></div>
            </div>
            <h3 className="font-amarante font-bold text-lg mtg-card-title relative z-10">{card.name}</h3>
          </div>

          {/* Card Type with texture background */}
          <div className={`px-3 py-1 border-b border-gray-400 text-sm relative z-10 overflow-hidden`}>
            {/* Header texture background */}
            <div className="absolute inset-0 z-0">
              <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
              <div className={`absolute inset-0 ${styles.tint} opacity-40 mix-blend-multiply`}></div>
            </div>
            <span className="font-amarante mtg-card-type relative z-10">{card.type}</span>
          </div>

          {/* Smaller Card Image */}
          <div className="h-[120px] relative border-b border-gray-400 z-10 bg-white bg-opacity-70">
            <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" priority />
          </div>

          {/* Extended Rules Text Area */}
          <div className="p-3 text-sm h-[200px] overflow-y-auto relative z-10 bg-white bg-opacity-70">
            <div className="space-y-1">
              {card.rulesText.split("\n").map((line, i) => (
                <p key={i} className="font-amarante mtg-card-text">
                  {line}
                </p>
              ))}
            </div>

            {card.flavorText && (
              <div className="mt-4 pt-3 border-t border-gray-300">
                <p className="font-amarante italic text-gray-600 text-xs leading-relaxed mtg-card-flavor">
                  {card.flavorText}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Standard layout (original)
  return (
    <div className="bg-transparent p-4">
      <div
        ref={ref}
        className={`w-[300px] h-[420px] rounded-[16px] overflow-hidden border-8 ${styles.border} shadow-lg ${styles.textColor} relative bg-white`}
      >
        {/* Texture background with color tint */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
          <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
        </div>

        {/* Card Title with texture background */}
        <div className={`px-3 py-1 border-b border-gray-400 relative z-10 overflow-hidden`}>
          {/* Header texture background */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
            <div className={`absolute inset-0 ${styles.tint} opacity-40 mix-blend-multiply`}></div>
          </div>
          <h3 className="font-amarante font-bold text-lg mtg-card-title relative z-10">{card.name}</h3>
        </div>

        {/* Card Image */}
        <div className="h-[180px] relative border-b border-gray-400 z-10 bg-white bg-opacity-70">
          <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" priority />
        </div>

        {/* Card Type with texture background */}
        <div className={`px-3 py-1 border-b border-gray-400 text-sm relative z-10 overflow-hidden`}>
          {/* Header texture background */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
            <div className={`absolute inset-0 ${styles.tint} opacity-40 mix-blend-multiply`}></div>
          </div>
          <span className="font-amarante mtg-card-type relative z-10">{card.type}</span>
        </div>

        {/* Rules Text */}
        <div className="p-3 text-sm space-y-1 overflow-y-hidden relative z-10 bg-white bg-opacity-70">
          {card.rulesText.split("\n").map((line, i) => (
            <p key={i} className="font-amarante mtg-card-text">
              {line}
            </p>
          ))}

          {card.flavorText && (
            <p className="font-amarante italic text-gray-600 border-t border-gray-300 pt-2 mtg-card-flavor">
              {card.flavorText}
            </p>
          )}
        </div>
      </div>
    </div>
  )
})

CardPreview.displayName = "CardPreview"
