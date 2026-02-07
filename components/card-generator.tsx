'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Edit,
  GalleryThumbnailsIcon as Gallery,
  PlusCircle,
  Save,
  Upload,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useImageStorage } from '@/hooks/use-image-storage';
import { useToast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';
import { BatchUploader } from './batch-uploader';
import { CardForm } from './card-form';
import { CardGallery } from './card-gallery';
import { CardPreview } from './card-preview';

export type CardData = {
  name: string;
  type: string;
  color: string;
  rulesText: string;
  flavorText: string;
  image: string;
  layout: 'standard' | 'text-heavy' | 'utility' | 'back';
  font: 'amarante' | 'eb-garamond';
  texture: 'default' | 'chernobyl' | 'lava' | 'rock' | 'oxido';
  imagePosition?:
    | 'object-top-left'
    | 'object-top'
    | 'object-top-right'
    | 'object-left'
    | 'object-center'
    | 'object-right'
    | 'object-bottom-left'
    | 'object-bottom'
    | 'object-bottom-right';
  id?: string;
  createdAt?: string;
};

const defaultCard: CardData = {
  name: 'Mystic Elemental',
  type: '',
  color: 'blue',
  rulesText:
    '**Flying**\nWhen this creature enters the battlefield, *draw a card*.',
  flavorText: '',
  image: '/placeholder.svg?height=400&width=400',
  layout: 'standard',
  font: 'eb-garamond',
  texture: 'rock',
  imagePosition: 'object-center',
};

export function CardGenerator() {
  const [card, setCard] = useState<CardData>(defaultCard);
  const [savedCards, setSavedCards] = useState<CardData[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mtg-cards');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState('editor');
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { loadImage, deleteImage, isInitialized } = useImageStorage();

  // Load images from IndexedDB when component mounts or cards change
  useEffect(() => {
    if (!isInitialized) return;

    const loadImages = async () => {
      const newImageUrls: Record<string, string> = {};

      for (const savedCard of savedCards) {
        if (savedCard.image && savedCard.image.startsWith('indexeddb://')) {
          try {
            const blobUrl = await loadImage(savedCard.image);
            if (blobUrl) {
              newImageUrls[savedCard.image] = blobUrl;
            }
          } catch (error) {
            console.error('Error loading image:', error);
          }
        }
      }

      // Also load current card image if it's from IndexedDB
      if (card.image && card.image.startsWith('indexeddb://')) {
        try {
          const blobUrl = await loadImage(card.image);
          if (blobUrl) {
            newImageUrls[card.image] = blobUrl;
          }
        } catch (error) {
          console.error('Error loading current card image:', error);
        }
      }

      setImageUrls(newImageUrls);
    };

    loadImages();
  }, [isInitialized, savedCards, loadImage]);

  // Function to get the actual image URL (either blob URL or original URL)
  const getImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('indexeddb://')) {
      return imageUrls[imageUrl] || imageUrl;
    }
    return imageUrl;
  };

  const handleChange = (field: keyof CardData, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (imageUrl: string) => {
    setCard((prev) => ({ ...prev, image: imageUrl }));

    // If it's an IndexedDB URL, load the blob URL for immediate preview
    if (imageUrl.startsWith('indexeddb://')) {
      try {
        const blobUrl = await loadImage(imageUrl);
        if (blobUrl) {
          setImageUrls((prev) => ({ ...prev, [imageUrl]: blobUrl }));
        }
      } catch (error) {
        console.error('Error loading uploaded image:', error);
      }
    }
  };

  const saveCard = () => {
    const cardToSave = {
      ...card,
      id: card.id || Date.now().toString(),
      createdAt: card.createdAt || new Date().toISOString(),
    };

    const existingIndex = savedCards.findIndex((c) => c.id === cardToSave.id);
    let newSavedCards: CardData[];

    if (existingIndex >= 0) {
      // Update existing card
      newSavedCards = [...savedCards];
      newSavedCards[existingIndex] = cardToSave;
      toast({
        title: 'Card Updated',
        description: `"${card.name}" has been updated in your collection.`,
      });
    } else {
      // Add new card
      newSavedCards = [...savedCards, cardToSave];
      toast({
        title: 'Card Saved',
        description: `"${card.name}" has been saved to your collection.`,
      });
    }

    setSavedCards(newSavedCards);
    localStorage.setItem('mtg-cards', JSON.stringify(newSavedCards));
    setCard(cardToSave);
  };

  const exportCard = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          quality: 0.95,
          pixelRatio: 2,
        });

        // Create download link
        const link = document.createElement('a');
        link.download = `${card.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();

        toast({
          title: 'Card Exported',
          description: 'Your card has been exported as a PNG image.',
        });
      } catch (error) {
        toast({
          title: 'Export Failed',
          description: 'There was an error exporting your card.',
          variant: 'destructive',
        });
      }
    }
  };

  const loadCard = async (cardToLoad: CardData) => {
    setCard(cardToLoad);
    setActiveTab('editor');

    // Load image if it's from IndexedDB
    if (cardToLoad.image && cardToLoad.image.startsWith('indexeddb://')) {
      try {
        const blobUrl = await loadImage(cardToLoad.image);
        if (blobUrl) {
          setImageUrls((prev) => ({ ...prev, [cardToLoad.image]: blobUrl }));
        }
      } catch (error) {
        console.error('Error loading card image:', error);
      }
    }

    toast({
      title: 'Card Loaded',
      description: `"${cardToLoad.name}" has been loaded into the editor.`,
    });
  };

  const deleteCard = async (cardId: string) => {
    const cardToDelete = savedCards.find((c) => c.id === cardId);

    // Delete associated image from IndexedDB
    if (cardToDelete?.image && cardToDelete.image.startsWith('indexeddb://')) {
      try {
        await deleteImage(cardToDelete.image);
        // Remove from imageUrls state
        setImageUrls((prev) => {
          const newUrls = { ...prev };
          delete newUrls[cardToDelete.image];
          return newUrls;
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    const newSavedCards = savedCards.filter((c) => c.id !== cardId);
    setSavedCards(newSavedCards);
    localStorage.setItem('mtg-cards', JSON.stringify(newSavedCards));

    // If we're currently editing the deleted card, reset to default
    if (card.id === cardId) {
      setCard(defaultCard);
    }
  };

  const duplicateCard = (cardToDuplicate: CardData) => {
    const duplicatedCard = {
      ...cardToDuplicate,
      name: `${cardToDuplicate.name} (Copy)`,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const newSavedCards = [...savedCards, duplicatedCard];
    setSavedCards(newSavedCards);
    localStorage.setItem('mtg-cards', JSON.stringify(newSavedCards));

    toast({
      title: 'Card Duplicated',
      description: `"${duplicatedCard.name}" has been added to your collection.`,
    });
  };

  const createNewCard = () => {
    setCard(defaultCard);
    setActiveTab('editor');
    toast({
      title: 'New Card',
      description: 'Started creating a new card.',
    });
  };

  const handleBatchComplete = (newCards: CardData[]) => {
    const updatedCards = [...savedCards, ...newCards];
    setSavedCards(updatedCards);
    localStorage.setItem('mtg-cards', JSON.stringify(updatedCards));
    setActiveTab('gallery');
  };

  // Create a card object with resolved image URLs for rendering
  const cardWithResolvedImage = {
    ...card,
    image: getImageUrl(card.image),
  };

  const savedCardsWithResolvedImages = savedCards.map((savedCard) => ({
    ...savedCard,
    image: getImageUrl(savedCard.image),
  }));

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="editor" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Card Editor
        </TabsTrigger>
        <TabsTrigger value="batch" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Batch Upload
        </TabsTrigger>
        <TabsTrigger value="gallery" className="flex items-center gap-2">
          <Gallery className="h-4 w-4" />
          Gallery ({savedCards.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="editor" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CardForm
              card={card}
              onChange={handleChange}
              onImageUpload={handleImageUpload}
            />
            <div className="flex gap-4 mt-6">
              <Button onClick={saveCard} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {card.id ? 'Update Card' : 'Save Card'}
              </Button>
              <Button onClick={exportCard} className="flex-1">
                <Download className="mr-2 h-4 w-4" /> Export as Image
              </Button>
              <Button
                variant={'secondary'}
                onClick={createNewCard}
                className="flex-1"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> New Card
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:sticky lg:top-8 lg:self-start">
            <CardPreview ref={cardRef} card={cardWithResolvedImage} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="batch" className="mt-6">
        <BatchUploader onBatchComplete={handleBatchComplete} />
      </TabsContent>

      <TabsContent value="gallery" className="mt-6">
        <CardGallery
          cards={savedCardsWithResolvedImages}
          onLoadCard={loadCard}
          onDeleteCard={deleteCard}
          onDuplicateCard={duplicateCard}
          onCreateNew={createNewCard}
        />
      </TabsContent>
    </Tabs>
  );
}
