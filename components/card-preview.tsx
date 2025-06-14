import Image from 'next/image';
import { forwardRef } from 'react';
import type { CardData } from './card-generator';

interface CardPreviewProps {
  card: CardData;
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ card }, ref) => {
    // Color mapping for card frames
    const colorStyles: Record<
      string,
      {
        border: string;
        tint: string;
        textColor: string;
        opacity: string;
      }
    > = {
      white: {
        border: 'border-stone-200',
        tint: 'bg-stone-50',
        textColor: 'text-gray-950',
        opacity: 'opacity-70',
      },
      blue: {
        border: 'border-blue-200',
        tint: 'bg-sky-600',
        textColor: 'text-gray-950',
        opacity: 'opacity-60',
      },
      black: {
        border: 'border-stone-900',
        tint: 'bg-gray-800',
        textColor: 'text-gray-950',
        opacity: 'opacity-30',
      },
      red: {
        border: 'border-red-900',
        tint: 'bg-red-600',
        textColor: 'text-gray-950',
        opacity: 'opacity-60',
      },
      purple: {
        border: 'border-purple-950',
        tint: 'bg-purple-500',
        textColor: 'text-gray-950',
        opacity: 'opacity-50',
      },
      green: {
        border: 'border-green-800',
        tint: 'bg-green-500',
        textColor: 'text-gray-950',
        opacity: 'opacity-50',
      },
      gold: {
        border: 'border-yellow-200',
        tint: 'bg-yellow-400',
        textColor: 'text-gray-950',
        opacity: 'opacity-40',
      },
      sepia: {
        border: 'border-yellow-900',
        tint: 'bg-[#f2be63]',
        textColor: 'text-gray-950',
        opacity: 'opacity-70',
      },
      colorless: {
        border: 'border-gray-500',
        tint: 'bg-gray-400',
        textColor: 'text-gray-950',
        opacity: 'opacity-10',
      },
    };

    const styles = colorStyles[card.color] || colorStyles.colorless;

    const fontStyle =
      card.font === 'fontarda'
        ? 'font-fontarda tracking-tight'
        : 'font-amarante';

    // Utility layout - compact card with only name and image
    if (card.layout === 'utility') {
      return (
        <div className="bg-stone-950">
          <div
            ref={ref}
            className={`w-[205px] flex flex-col h-[285px] gap-2 rounded-[14px] overflow-hidden border-8 border-stone-950 shadow-lg ${styles.textColor} relative bg-white dark:bg-white`}
          >
            {/* Single texture background with color tint for entire card */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/card-texture.jpg"
                alt="Card texture"
                fill
                className="object-cover"
                priority
              />
              <div
                className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}
              ></div>
            </div>

            {/* Card Title with margin */}
            <div className="mx-3 mt-3 relative z-10">
              <h3
                className={`${fontStyle} font-bold text-sm text-center bg-white bg-opacity-80 px-2 py-0.5 rounded border-4 ${styles.border} `}
              >
                {card.name}
              </h3>
            </div>

            {/* Card Image with margin */}
            <div
              className={`relative z-10 mx-3 flex-1 mb-3 rounded bg-white bg-opacity-80 border-4 ${styles.border}  overflow-hidden`}
            >
              <Image
                src={card.image || '/placeholder.svg'}
                alt={card.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      );
    }

    // Text-heavy layout
    if (card.layout === 'text-heavy') {
      return (
        <div>
          <div className="bg-stone-950">
            <div
              ref={ref}
              className={`w-[295px] h-[430px] rounded-[16px] flex flex-col gap-2 overflow-hidden border-[12px] border-stone-950 shadow-lg ${styles.textColor} relative bg-white dark:bg-white`}
            >
              {/* Single texture background with color tint for entire card */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/card-texture.jpg"
                  alt="Card texture"
                  fill
                  className="object-cover"
                  priority
                />
                <div
                  className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}
                ></div>
              </div>

              {/* Card Title with margin */}
              <div className="mx-2 mt-2 relative z-10">
                <h3
                  className={`${fontStyle} font-bold text-md bg-white bg-opacity-80 px-3 py-0.5 rounded border-4 ${styles.border}`}
                >
                  {card.name}
                </h3>
              </div>

              {/* Card Image with margin */}
              <div
                className={`h-[140px] relative z-10 mx-2 rounded border-4 ${styles.border}  overflow-hidden bg-white bg-opacity-80`}
              >
                <Image
                  src={card.image || '/placeholder.svg'}
                  alt={card.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Card Type with margin - only show if type exists */}
                {card.type && card.type.trim() && (
                  <div className="absolute bottom-0 w-full left-0 z-10">
                    <span
                      className={`${fontStyle} w-full text-xs bg-white bg-opacity-70 px-3 py-0.5 inline-block`}
                    >
                      {card.type}
                    </span>
                  </div>
                )}
              </div>

              {/* Rules Text with margin */}

              <div
                className={`mx-2 mb-2 text-xs flex-1 overflow-y-hidden relative z-10 bg-white bg-opacity-80 p-3 rounded border-4 ${styles.border} `}
              >
                <div className="absolute m-2 inset-0 z-0">
                  <Image
                    src="/images/dnd-logo.jpg"
                    alt="Card watermark"
                    fill
                    className="object-contain opacity-5"
                    priority
                  />
                </div>
                {card.rulesText.split('\n').map((line, i) => (
                  <div key={i} className={`${fontStyle} z-20`}>
                    {line}
                  </div>
                ))}
                <div className="border-t-2 border-gray-300 pt-1 mt-1"></div>
                {card.flavorText && (
                  <div
                    className={`${fontStyle} text-xs z-20 italic text-gray-500 `}
                  >
                    {card.flavorText}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Standard layout (original)

    return (
      <div>
        <div className="bg-stone-950">
          <div
            ref={ref}
            className={`w-[295px] h-[430px] rounded-[16px] flex flex-col gap-2 overflow-hidden border-[12px] border-stone-950 shadow-lg ${styles.textColor} relative bg-white dark:bg-white`}
          >
            {/* Single texture background with color tint for entire card */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/card-texture.jpg"
                alt="Card texture"
                fill
                className="object-cover"
                priority
              />
              <div
                className={`absolute inset-0 ${styles.tint} ${styles.opacity} mix-blend-multiply`}
              ></div>
            </div>

            {/* Card Title with margin */}
            <div className="mx-2 mt-2 relative z-10">
              <h3
                className={`${fontStyle} font-bold text-md bg-white bg-opacity-80 px-3 py-0.5 rounded border-4 ${styles.border}`}
              >
                {card.name}
              </h3>
            </div>

            {/* Card Image with margin */}
            <div
              className={`h-[180px] relative z-10 mx-2 rounded border-4 ${styles.border}  overflow-hidden bg-white bg-opacity-80`}
            >
              <Image
                src={card.image || '/placeholder.svg'}
                alt={card.name}
                fill
                className="object-cover"
                priority
              />
              {/* Card Type with margin - only show if type exists */}
              {card.type && card.type.trim() && (
                <div className="absolute bottom-0 w-full left-0 z-10">
                  <span
                    className={`${fontStyle} w-full text-xs bg-white bg-opacity-70 px-3 py-0.5 inline-block`}
                  >
                    {card.type}
                  </span>
                </div>
              )}
            </div>

            {/* Rules Text with margin */}

            <div
              className={`mx-2 mb-2 text-xs flex-1 overflow-y-hidden relative z-10 bg-white bg-opacity-80 p-3 rounded border-4 ${styles.border} `}
            >
              <div className="absolute m-2 inset-0 z-0">
                <Image
                  src="/images/dnd-logo.jpg"
                  alt="Card watermark"
                  fill
                  className="object-contain opacity-5"
                  priority
                />
              </div>
              {card.rulesText.split('\n').map((line, i) => (
                <div key={i} className={`${fontStyle} z-20`}>
                  {line}
                </div>
              ))}
              <div className="border-t-2 border-gray-300 pt-1 mt-1"></div>
              {card.flavorText && (
                <div
                  className={`${fontStyle} text-xs z-20 italic text-gray-500`}
                >
                  {card.flavorText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CardPreview.displayName = 'CardPreview';
