import { marked } from "marked"
import Image from "next/image"
import { forwardRef } from "react"
import type { CardData } from "./card-generator"

interface CardPreviewProps {
  card: CardData
}

const parseMarkdown = (text: string): string => {
  try {
    // Use marked.parseInline for inline markdown (no <p> tags)
    const parsed = marked.parseInline(text, {
      breaks: true,
      gfm: true,
    })
    return typeof parsed === "string" ? parsed : String(parsed)
  } catch (error) {
    console.error("Markdown parsing error:", error)
    return text.replace(/\n/g, "<br>")
  }
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ card }, ref) => {
  // Texture mapping
  const textureStyles: Record<string, { src: string; watermark?: string }> = {
    default: {
      src: "/images/card-texture.png",
      watermark: "/images/dnd-logo.jpg",
    },
    chernobyl: {
      src: "/images/chernobil2.png",
      watermark: "/images/dnd-logo.jpg",
    },
    lava: {
      src: "/images/lava.png",
      watermark: "/images/dnd-logo.jpg",
    },
    metal: {
      src: "/images/card-texture.png", // Using default for now, can be replaced
      watermark: "/images/dnd-logo.jpg",
    },
  }

  // Color mapping for card frames - different styles per texture
  const getColorStyles = (texture: string, color: string) => {
    const colorMappings: Record<
      string,
      Record<
        string,
        {
          border: string
          tint: string
          textColor: string
          opacity: string
          titleBg: string
        }
      >
    > = {
      default: {
        white: {
          border: "border-stone-200",
          tint: "bg-stone-50",
          textColor: "text-gray-950",
          opacity: "opacity-70",
          titleBg: "bg-white bg-opacity-60",
        },
        blue: {
          border: "border-sky-900",
          tint: "bg-sky-600",
          textColor: "text-gray-950",
          opacity: "opacity-60",
          titleBg: "bg-blue-100 bg-opacity-80",
        },
        black: {
          border: "border-stone-900",
          tint: "bg-stone-800",
          textColor: "text-gray-950",
          opacity: "opacity-40",
          titleBg: "bg-gray-200 bg-opacity-90",
        },
        red: {
          border: "border-red-950",
          tint: "bg-red-800",
          textColor: "text-gray-950",
          opacity: "opacity-80",
          titleBg: "bg-red-100 bg-opacity-80",
        },
        purple: {
          border: "border-purple-950",
          tint: "bg-purple-500",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-purple-100 bg-opacity-80",
        },
        green: {
          border: "border-green-800",
          tint: "bg-green-500",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-green-100 bg-opacity-80",
        },
        gold: {
          border: "border-yellow-800",
          tint: "bg-yellow-400",
          textColor: "text-gray-950",
          opacity: "opacity-60",
          titleBg: "bg-yellow-100 bg-opacity-80",
        },
        sepia: {
          border: "border-yellow-900",
          tint: "bg-[#f2be63]",
          textColor: "text-gray-950",
          opacity: "opacity-80",
          titleBg: "bg-amber-100 bg-opacity-80",
        },
        colorless: {
          border: "border-gray-500",
          tint: "bg-gray-400",
          textColor: "text-gray-950",
          opacity: "opacity-10",
          titleBg: "bg-white bg-opacity-60",
        },
      },
      chernobyl: {
        white: {
          border: "border-gray-400",
          tint: "bg-gray-300",
          textColor: "text-gray-950",
          opacity: "opacity-30",
          titleBg: "bg-gray-100 bg-opacity-90",
        },
        blue: {
          border: "border-cyan-700",
          tint: "bg-cyan-500",
          textColor: "text-gray-950",
          opacity: "opacity-40",
          titleBg: "bg-cyan-100 bg-opacity-90",
        },
        black: {
          border: "border-gray-900",
          tint: "bg-gray-900",
          textColor: "text-gray-100",
          opacity: "opacity-60",
          titleBg: "bg-gray-800 bg-opacity-90 text-gray-100",
        },
        red: {
          border: "border-red-800",
          tint: "bg-[#731f1f]",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-red-200 bg-opacity-90",
        },
        purple: {
          border: "border-purple-800",
          tint: "bg-purple-600",
          textColor: "text-gray-950",
          opacity: "opacity-40",
          titleBg: "bg-purple-200 bg-opacity-90",
        },
        green: {
          border: "border-green-700",
          tint: "bg-green-600",
          textColor: "text-gray-950",
          opacity: "opacity-40",
          titleBg: "bg-green-200 bg-opacity-90",
        },
        gold: {
          border: "border-yellow-700",
          tint: "bg-yellow-500",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-yellow-200 bg-opacity-90",
        },
        sepia: {
          border: "border-amber-800",
          tint: "bg-amber-600",
          textColor: "text-gray-950",
          opacity: "opacity-60",
          titleBg: "bg-amber-200 bg-opacity-90",
        },
        colorless: {
          border: "border-gray-600",
          tint: "bg-gray-500",
          textColor: "text-gray-950",
          opacity: "opacity-20",
          titleBg: "bg-gray-200 bg-opacity-90",
        },
      },
      lava: {
        white: {
          border: "border-orange-300",
          tint: "bg-orange-200",
          textColor: "text-gray-950",
          opacity: "opacity-40",
          titleBg: "bg-orange-50 bg-opacity-90",
        },
        blue: {
          border: "border-blue-800",
          tint: "bg-blue-600",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-blue-100 bg-opacity-90",
        },
        black: {
          border: "border-red-900",
          tint: "bg-red-950",
          textColor: "text-orange-100",
          opacity: "opacity-70",
          titleBg: "bg-red-900 bg-opacity-90 text-orange-100",
        },
        red: {
          border: "border-red-700",
          tint: "bg-red-600",
          textColor: "text-gray-950",
          opacity: "opacity-60",
          titleBg: "bg-red-100 bg-opacity-90",
        },
        purple: {
          border: "border-purple-700",
          tint: "bg-purple-600",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-purple-100 bg-opacity-90",
        },
        green: {
          border: "border-emerald-700",
          tint: "bg-emerald-600",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-emerald-100 bg-opacity-90",
        },
        gold: {
          border: "border-amber-600",
          tint: "bg-amber-500",
          textColor: "text-gray-950",
          opacity: "opacity-60",
          titleBg: "bg-amber-100 bg-opacity-90",
        },
        sepia: {
          border: "border-orange-700",
          tint: "bg-orange-600",
          textColor: "text-gray-950",
          opacity: "opacity-70",
          titleBg: "bg-orange-100 bg-opacity-90",
        },
        colorless: {
          border: "border-stone-600",
          tint: "bg-stone-500",
          textColor: "text-gray-950",
          opacity: "opacity-30",
          titleBg: "bg-stone-100 bg-opacity-90",
        },
      },
      metal: {
        white: {
          border: "border-slate-300",
          tint: "bg-slate-200",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-slate-100 bg-opacity-90",
        },
        blue: {
          border: "border-blue-700",
          tint: "bg-blue-500",
          textColor: "text-gray-950",
          opacity: "opacity-40",
          titleBg: "bg-blue-100 bg-opacity-90",
        },
        black: {
          border: "border-slate-800",
          tint: "bg-slate-700",
          textColor: "text-slate-100",
          opacity: "opacity-60",
          titleBg: "bg-slate-800 bg-opacity-90 text-slate-100",
        },
        red: {
          border: "border-red-700",
          tint: "bg-red-600",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-red-100 bg-opacity-90",
        },
        purple: {
          border: "border-purple-700",
          tint: "bg-purple-500",
          textColor: "text-gray-950",
          opacity: "opacity-40",
          titleBg: "bg-purple-100 bg-opacity-90",
        },
        green: {
          border: "border-green-700",
          tint: "bg-green-500",
          textColor: "text-gray-950",
          opacity: "opacity-40",
          titleBg: "bg-green-100 bg-opacity-90",
        },
        gold: {
          border: "border-yellow-600",
          tint: "bg-yellow-400",
          textColor: "text-gray-950",
          opacity: "opacity-50",
          titleBg: "bg-yellow-100 bg-opacity-90",
        },
        sepia: {
          border: "border-amber-700",
          tint: "bg-amber-500",
          textColor: "text-gray-950",
          opacity: "opacity-60",
          titleBg: "bg-amber-100 bg-opacity-90",
        },
        colorless: {
          border: "border-slate-500",
          tint: "bg-slate-400",
          textColor: "text-gray-950",
          opacity: "opacity-30",
          titleBg: "bg-slate-100 bg-opacity-90",
        },
      },
    }

    return colorMappings[texture]?.[color] || colorMappings.default.colorless
  }

  const texture = textureStyles[card.texture] || textureStyles.default
  const styles = getColorStyles(card.texture, card.color)

  const fontStyle =
    card.font === "fontarda"
      ? "font-fontarda tracking-tight"
      : card.font === "eb-garamond"
        ? "font-eb-garamond"
        : "font-amarante"

  if (card.layout === "back") {
    // Back layout - just show the back image
    return (
      <div>
        <div ref={ref} className="bg-stone-950">
          <div
            className={`w-[268px] h-[403px] rounded-[21px] flex flex-col gap-2 overflow-hidden box-content border-[15px] border-stone-950 shadow-lg ${styles.textColor} relative `}
          >
            {/* Single texture background with color tint for entire card */}
            <div className="absolute inset-0 z-0">
              <Image
                src={texture.src || "/placeholder.svg"}
                alt="Card texture"
                fill
                className="object-cover"
                priority
              />
              <div className={`absolute inset-0 ${styles.tint} mix-blend-multiply`}></div>
              {texture.watermark && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={texture.watermark || "/placeholder.svg"}
                    alt="Card watermark"
                    fill
                    className="object-cover opacity-[12%]"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Utility layout - compact card with only name and image
  if (card.layout === "utility") {
    return (
      <div ref={ref} className="bg-stone-950">
        <div
          className={`w-[205px] flex flex-col box-content gap-2 rounded-[14px] overflow-hidden border-8 border-stone-950 shadow-lg ${styles.textColor} relative `}
        >
          {/* Single texture background with color tint for entire card */}
          <div className="absolute inset-0 z-0">
            <Image src={texture.src || "/placeholder.svg"} alt="Card texture" fill className="object-cover" priority />
            <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
          </div>

          {/* Card Title with margin */}
          <div className="mx-3 mt-3 relative z-10">
            <h3
              className={`${fontStyle} font-bold text-sm text-center box-content ${styles.titleBg} px-2 py-0.5 rounded border-4 ${styles.border} `}
            >
              {card.name}
            </h3>
          </div>

          {/* Card Image with margin */}
          <div
            className={`relative z-10 mx-3 flex-1 mb-4 box-content rounded border-4 ${styles.border}  overflow-hidden`}
          >
            <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" priority />
          </div>
          {/* Card Type with margin - only show if type exists */}
          {card.type && card.type.trim() && (
            <div className="absolute bottom-0 right-0 z-10">
              <span className={`${fontStyle} text-[8px] px-3 py-0 inline-block`}>{card.type}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Text-heavy layout
  if (card.layout === "text-heavy") {
    return (
      <div>
        <div ref={ref} className="bg-stone-950">
          <div
            className={`w-[271px] h-[406px] rounded-[16px] box-content flex flex-col gap-2 overflow-hidden border-[12px] border-stone-950 shadow-lg ${styles.textColor} relative`}
          >
            {/* Single texture background with color tint for entire card */}
            <div className="absolute inset-0 z-0">
              <Image
                src={texture.src || "/placeholder.svg"}
                alt="Card texture"
                fill
                className="object-cover"
                priority
              />
              <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
            </div>

            {/* Card Title with margin */}
            <div className="mx-2 mt-2 relative z-10">
              <h3
                className={`${fontStyle} font-bold text-md ${styles.titleBg} box-content px-3 py-0.5 rounded border-4 ${styles.border}`}
              >
                {card.name}
              </h3>
            </div>

            {/* Card Image with margin */}
            <div
              className={`h-[140px] relative box-content z-10 mx-2 rounded border-4 ${styles.border}  overflow-hidden`}
            >
              <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" priority />
            </div>

            {/* Rules Text with margin */}

            <div
              className={`mx-2 mb-2 text-xs flex-1 overflow-y-hidden relative z-10 bg-white bg-opacity-80 p-3 rounded border-4 ${styles.border} `}
            >
              {texture.watermark && (
                <div className="absolute m-2 inset-0">
                  <Image
                    src={texture.watermark || "/placeholder.svg"}
                    alt="Card watermark"
                    fill
                    className="object-contain opacity-5"
                    priority
                  />
                </div>
              )}
              <div
                className={`${fontStyle} z-20 card-text`}
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(card.rulesText),
                }}
              />
              <div className="pt-1 mt-1"></div>
              {card.flavorText && (
                <div className={`${fontStyle} text-xs z-20 italic text-gray-700`}>{card.flavorText}</div>
              )}
              {/* Card Type with margin - only show if type exists */}
              {card.type && card.type.trim() && (
                <div className="absolute bottom-0 right-0 z-10">
                  <span className={`${fontStyle} text-[8px] px-3 py-0 inline-block`}>{card.type}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Standard layout (original)
  return (
    <div>
      <div ref={ref} className="bg-stone-950">
        <div
          className={`w-[271px] h-[406px] box-content rounded-[16px] flex flex-col gap-2 overflow-hidden border-[12px] border-stone-950 shadow-lg ${styles.textColor} relative `}
        >
          {/* Single texture background with color tint for entire card */}
          <div className="absolute inset-0 z-0">
            <Image src={texture.src || "/placeholder.svg"} alt="Card texture" fill className="object-cover" priority />
            <div className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}></div>
          </div>

          {/* Card Title with margin */}
          <div className="mx-2 mt-2 relative z-10">
            <h3
              className={`${fontStyle} font-bold text-md ${styles.titleBg} box-content px-3 py-0.5 rounded border-4 ${styles.border}`}
            >
              {card.name}
            </h3>
          </div>

          {/* Card Image with margin */}
          <div className={`h-[180px] relative z-10 mx-2 rounded border-4 box-content ${styles.border} overflow-hidden`}>
            <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
          </div>

          {/* Rules Text with margin */}

          <div
            className={`mx-2 mb-2 text-xs flex-1 overflow-y-hidden box-content relative z-10 bg-white bg-opacity-80 p-3 rounded border-4 ${styles.border} `}
          >
            {texture.watermark && (
              <div className="absolute m-2 inset-0">
                <Image
                  src={texture.watermark || "/placeholder.svg"}
                  alt="Card watermark"
                  fill
                  className="object-contain opacity-5"
                  priority
                />
              </div>
            )}
            <div
              className={`${fontStyle} z-20 card-text`}
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(card.rulesText),
              }}
            />
            <div className="pt-1 mt-1"></div>
            {card.flavorText && (
              <div className={`${fontStyle} text-xs z-20 italic text-gray-700`}>{card.flavorText}</div>
            )}
            {/* Card Type with margin - only show if type exists */}
            {card.type && card.type.trim() && (
              <div className="absolute bottom-0 right-0 z-20">
                <span className={`${fontStyle} text-[8px] px-3 py-0 inline-block`}>{card.type}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

CardPreview.displayName = "CardPreview"
