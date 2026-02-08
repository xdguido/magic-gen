'use client';

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
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import {
  CheckSquare,
  Copy,
  Download,
  Edit,
  GalleryThumbnailsIcon as Gallery,
  Loader2,
  Plus,
  Search,
  Square,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { CardData } from './card-generator';
import { CardPreview } from './card-preview';

interface CardGalleryProps {
  cards: CardData[];
  onLoadCard: (card: CardData) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteCards: (cardIds: string[]) => void;
  onDuplicateCard: (card: CardData) => void;
  onCreateNew: () => void;
}

export function CardGallery({
  cards,
  onLoadCard,
  onDeleteCard,
  onDeleteCards,
  onDuplicateCard,
  onCreateNew,
}: CardGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState('all');
  const [layoutFilter, setLayoutFilter] = useState('all');
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = colorFilter === 'all' || card.color === colorFilter;
    const matchesLayout =
      layoutFilter === 'all' || card.layout === layoutFilter;

    return matchesSearch && matchesColor && matchesLayout;
  });

  const toggleSelectCard = (cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCards.size === filteredCards.length) {
      setSelectedCards(new Set());
    } else {
      const newSelected = new Set(
        filteredCards.map((c) => c.id).filter((id): id is string => !!id)
      );
      setSelectedCards(newSelected);
    }
  };

  const handleBatchDelete = () => {
    const idsToDelete = Array.from(selectedCards);
    onDeleteCards(idsToDelete);
    setSelectedCards(new Set());
  };

  const handleBatchDownload = async () => {
    if (selectedCards.size === 0) return;

    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('cards');
      let count = 0;

      // Only download currently visible/filtered cards that are selected
      // This ensures they are in the DOM for html-to-image
      const cardsToDownload = filteredCards.filter(
        (c) => c.id && selectedCards.has(c.id)
      );

      for (const card of cardsToDownload) {
        if (!card.id) continue;

        const element = document.getElementById(`card-preview-${card.id}`);
        if (element) {
          try {
            const dataUrl = await toPng(element, {
              quality: 0.95,
              pixelRatio: 2,
            });

            // Remove header
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
            const fileName = `${card.title.replace(/\s+/g, '-').toLowerCase()}-${card.id.substr(0, 4)}.png`;
            folder?.file(fileName, base64Data, { base64: true });
            count++;
          } catch (e) {
            console.error(`Failed to capture card ${card.title}`, e);
          }
        }
      }

      if (count > 0) {
        const content = await zip.generateAsync({ type: 'blob' });
        const url = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'magic-cards.zip';
        link.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Download Ready',
          description: `Downloaded ${count} cards as a ZIP archive.`,
        });
      } else {
        toast({
          title: 'Download Failed',
          description: 'Could not generate images for selected cards.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Batch download error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during batch download.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLayoutBadgeColor = (layout: string) => {
    switch (layout) {
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'text-heavy':
        return 'bg-green-100 text-green-800';
      case 'utility':
        return 'bg-purple-100 text-purple-800';
      case 'simple':
        return 'bg-orange-100 text-orange-800';
      case 'text-only':
        return 'bg-red-100 text-red-800';
      case 'back':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Gallery className="mx-auto h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No cards saved yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first card to get started!
        </p>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Card
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and new card button */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
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
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="text-only">Text-Only</SelectItem>
                <SelectItem value="back">Back</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Card
          </Button>
        </div>

        {/* Batch toolbar */}
        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md border">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSelectAll}
              className="gap-2"
            >
              {selectedCards.size === filteredCards.length &&
              filteredCards.length > 0 ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              Select All
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              {selectedCards.size} selected
            </span>
          </div>

          {selectedCards.size > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBatchDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download ({selectedCards.size})
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedCards.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete {selectedCards.size} Cards?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete these {selectedCards.size}{' '}
                      cards? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBatchDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredCards.length} of {cards.length} cards
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className={`group relative p-2 rounded-lg border-2 transition-colors ${card.id && selectedCards.has(card.id) ? 'border-blue-500 bg-blue-50/10' : 'border-transparent hover:border-muted'}`}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-4 left-4 z-20">
              <Checkbox
                checked={card.id ? selectedCards.has(card.id) : false}
                onCheckedChange={() => card.id && toggleSelectCard(card.id)}
                className="bg-white/80 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
            </div>

            {/* Card preview */}
            <div
              className="mb-3 transform transition-transform group-hover:scale-105 cursor-pointer flex justify-center"
              onClick={() => card.id && toggleSelectCard(card.id)}
            >
              <div id={`card-preview-${card.id}`}>
                <CardPreview card={card} />
              </div>
            </div>

            {/* Card info and actions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm truncate">{card.title}</h3>
                <Badge
                  className={`text-xs ${getLayoutBadgeColor(card.layout)}`}
                >
                  {card.layout}
                </Badge>
              </div>

              <p className="text-xs text-gray-500 truncate">{card.type}</p>

              {card.createdAt && (
                <p className="text-xs text-gray-400">
                  Created {formatDate(card.createdAt)}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLoadCard(card)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDuplicateCard(card)}
                >
                  <Copy className="h-3 w-3" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Card</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{card.title}"? This
                        action cannot be undone.
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
  );
}
