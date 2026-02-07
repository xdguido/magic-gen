'use client';

import { FileUp, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useImageStorage } from '@/hooks/use-image-storage';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { useState } from 'react';
import { CardData } from './card-generator';

interface BatchUploaderProps {
  onBatchComplete: (cards: CardData[]) => void;
}

export function BatchUploader({ onBatchComplete }: BatchUploaderProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { saveImage } = useImageStorage();
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!csvFile) {
      toast({
        title: 'Missing CSV',
        description: 'Please upload a CSV file with card data.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Load ZIP contents if provided
      const zipImages: Record<string, Blob> = {};
      if (zipFile) {
        const zip = new JSZip();
        const contents = await zip.loadAsync(zipFile);

        for (const [filename, file] of Object.entries(contents.files)) {
          if (!file.dir) {
            // Get simple filename without path
            const simpleName = filename.split('/').pop() || filename;
            const blob = await file.async('blob');
            zipImages[simpleName] = blob;
          }
        }
      }

      // 2. Parse CSV
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const rows = results.data as any[];
          const newCards: CardData[] = [];
          let successCount = 0;
          let errorCount = 0;

          for (const row of rows) {
            try {
              if (!row.name) continue;

              let imageUrl =
                row.image || '/placeholder.svg?height=400&width=400';
              const imageFileName = row.imageFileName;

              // If imageFileName is provided and we have the image in the zip
              if (imageFileName && zipImages[imageFileName]) {
                const blob = zipImages[imageFileName];
                // Determine mime type from extension if possible, default to png
                const type =
                  imageFileName.endsWith('.jpg') ||
                  imageFileName.endsWith('.jpeg')
                    ? 'image/jpeg'
                    : 'image/png';

                const imageFile = new File([blob], imageFileName, { type });
                imageUrl = await saveImage(imageFile);
              }

              const newCard: CardData = {
                name: row.name,
                type: row.type || '',
                color: row.color || 'white',
                rulesText: row.rulesText || '',
                flavorText: row.flavorText || '',
                image: imageUrl,
                layout:
                  row.layout === 'text-heavy' ||
                  row.layout === 'utility' ||
                  row.layout === 'back'
                    ? row.layout
                    : 'standard',
                font: row.font === 'amarante' ? 'amarante' : 'eb-garamond',
                imagePosition: (
                  [
                    'object-top-left',
                    'object-top',
                    'object-top-right',
                    'object-left',
                    'object-center',
                    'object-right',
                    'object-bottom-left',
                    'object-bottom',
                    'object-bottom-right',
                  ] as const
                ).includes(row.imagePosition)
                  ? row.imagePosition
                  : 'object-center',
                texture: (
                  ['chernobyl', 'lava', 'rock', 'oxido'] as const
                ).includes(row.texture)
                  ? row.texture
                  : 'default',
                id:
                  Date.now().toString() + Math.random().toString().substr(2, 9),
                createdAt: new Date().toISOString(),
              };

              newCards.push(newCard);
              successCount++;
            } catch (err) {
              console.error('Error processing row:', row, err);
              errorCount++;
            }
          }

          onBatchComplete(newCards);
          setIsProcessing(false);

          toast({
            title: 'Batch Processing Complete',
            description: `Successfully created ${successCount} cards. ${errorCount > 0 ? `${errorCount} errors.` : ''}`,
          });

          // Reset forms
          setCsvFile(null);
          setZipFile(null);
          // Reset file inputs manually if needed, but managing via state is usually enough for the submit action
        },
        error: (error: any) => {
          console.error('CSV Parse Error:', error);
          setIsProcessing(false);
          toast({
            title: 'CSV Parsing Failed',
            description: error.message,
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      console.error('Batch Upload Error:', error);
      setIsProcessing(false);
      toast({
        title: 'Processing Failed',
        description: 'An unexpected error occurred during batch processing.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Batch Card Generator
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file containing card data and an optional ZIP file
            containing referenced images.
          </p>
        </div>
        <div className="p-6 pt-0 space-y-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-upload">Card Data (CSV)</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">
              Required headers: name. Optional: type, color, rulesText,
              flavorText, imageFileName, imagePosition, layout, font, texture.
            </p>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="zip-upload">Images (ZIP)</Label>
            <Input
              id="zip-upload"
              type="file"
              accept=".zip"
              onChange={(e) => setZipFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">
              Contains image files referenced by "imageFileName" in the CSV.
            </p>
          </div>

          <Button
            onClick={handleProcess}
            disabled={!csvFile || isProcessing}
            className="w-full max-w-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Generate Cards
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
