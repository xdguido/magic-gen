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
      border: "border-purple-950",
      tint: "bg-purple-500",
      titleBg: "bg-purple-300",
      textColor: "text-gray-950",
      opacity: "opacity-40",
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
    sepia: {
      border: "border-yellow-950",
      tint: "bg-[#f2be63]",
      titleBg: "bg-[#f2be63]",
      textColor: "text-gray-950",
      opacity: "opacity-70",
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
          className={`w-[205px] h-[285px] rounded-[12px] overflow-hidden border-6 ${styles.border} shadow-lg ${styles.textColor} relative bg-white dark:bg-white`}
        >
          {/* Single texture background with color tint for entire card */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
            <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
          </div>

          {/* Card Title with margin */}
          <div className="mx-3 my-2 relative z-10">
            <h3
              className={`font-amarante font-bold text-sm text-center mtg-card-title bg-white bg-opacity-80 px-2 py-1 rounded-md border-4 ${styles.border} dark:text-gray-950`}
            >
              {card.name}
            </h3>
          </div>

          {/* Card Image with margin */}
          <div className={`h-[220px] relative z-10 mx-3 mb-3 rounded-md border-4 ${styles.border} overflow-hidden`}>
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
          className={`w-[295px] h-[430px] rounded-[16px] overflow-hidden border-8 ${styles.border} shadow-lg ${styles.textColor} relative bg-white dark:bg-white`}
        >
          {/* Single texture background with color tint for entire card */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
            <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
          </div>

          {/* Card Title with margin */}
          <div className="mx-2 mt-3 mb-2 relative z-10">
            <h3
              className={`font-amarante font-bold text-lg mtg-card-title bg-white bg-opacity-80 px-3 py-1 rounded-md border-4 ${styles.border}/70 dark:text-gray-950`}
            >
              {card.name}
            </h3>
          </div>

          {/* Card Type with margin - only show if type exists */}
          {card.type && card.type.trim() && (
            <div className="mx-2 mb-2 relative z-10">
              <span className="font-amarante mtg-card-type text-sm bg-white bg-opacity-80 px-3 py-1 rounded-md inline-block dark:text-gray-950">
                {card.type}
              </span>
            </div>
          )}

          {/* Card Image with margin */}
          <div className={`h-[120px] relative z-10 mx-2 mb-2 rounded-md overflow-hidden border-4 ${styles.border}/70`}>
            <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" priority />
          </div>

          {/* Rules Text with margin */}
          <div
            className={`mx-2 mb-2 text-xs space-y-1 overflow-y-hidden relative z-10 bg-white bg-opacity-90 p-3 rounded-md border-4 ${styles.border}/70`}
          >
            <div className="space-y-1">
              {card.rulesText.split("\n").map((line, i) => (
                <p key={i} className="font-amarante mtg-card-text dark:text-gray-950">
                  {line}
                </p>
              ))}
            </div>

            {card.flavorText && (
              <div className="mt-4 pt-3 border-t border-gray-300">
                <p className="font-amarante italic text-gray-600 mtg-card-flavor dark:text-gray-950">
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
        className={`w-[295px] h-[430px] rounded-[16px] overflow-hidden border-8 ${styles.border} shadow-lg ${styles.textColor} relative bg-white dark:bg-white`}
      >
        {/* Single texture background with color tint for entire card */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/card-texture.jpg" alt="Card texture" fill className="object-cover" priority />
          <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
        </div>

        {/* Card Title with margin */}
        <div className="mx-2 mt-3 mb-2 relative z-10">
          <h3
            className={`font-amarante font-bold text-lg mtg-card-title bg-white bg-opacity-80 px-3 py-1 rounded-md border-4 ${styles.border}/70 dark:text-gray-950`}
          >
            {card.name}
          </h3>
        </div>

        {/* Card Image with margin */}
        <div className={`h-[180px] relative z-10 mx-2 mb-2 rounded-md border-4 ${styles.border}/70 overflow-hidden`}>
          <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" priority />
        </div>

        {/* Card Type with margin - only show if type exists */}
        {card.type && card.type.trim() && (
          <div className="mx-2 mb-2 relative z-10">
            <span className="font-amarante mtg-card-type text-sm bg-white bg-opacity-80 px-3 py-1 rounded-md inline-block dark:text-gray-950">
              {card.type}
            </span>
          </div>
        )}

        {/* Rules Text with margin */}
        <div
          className={`mx-2 mb-2 text-xs space-y-1 overflow-y-hidden relative z-10 bg-white bg-opacity-90 p-3 rounded-md border-4 ${styles.border}/70`}
        >
          {card.rulesText.split("\n").map((line, i) => (
            <p key={i} className="font-amarante mtg-card-text dark:text-gray-950">
              {line}
            </p>
          ))}

          {card.flavorText && (
            <p className="font-amarante text-xs italic text-gray-600 border-t border-gray-300 pt-2 mtg-card-flavor dark:text-gray-950">
              {card.flavorText}
            </p>
          )}
        </div>
      </div>
    </div>
  )
})

CardPreview.displayName = "CardPreview"
