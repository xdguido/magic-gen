'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { CardData } from './card-generator';

interface CardFormProps {
  card: CardData;
  onChange: (field: keyof CardData, value: string) => void;
  onImageUpload: (imageUrl: string) => void;
}

export function CardForm({ card, onChange, onImageUpload }: CardFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Card Name</Label>
        <Input
          id="name"
          value={card.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter card name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Card Type (Optional)</Label>
        <Input
          id="type"
          value={card.type}
          onChange={(e) => onChange('type', e.target.value)}
          placeholder="e.g. Creature — Elf, Instant, Sorcery"
        />
      </div>

      <div className="space-y-2">
        <Label>Card Color</Label>
        <RadioGroup
          value={card.color}
          onValueChange={(value) => onChange('color', value)}
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
        <Select
          value={card.texture}
          onValueChange={(value) => onChange('texture', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select texture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Parchment</SelectItem>
            <SelectItem value="chernobyl">Chernobyl Wasteland</SelectItem>
            <SelectItem value="lava">Lava Rock</SelectItem>
            <SelectItem value="metal">Metal Plate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Card Layout</Label>
        <RadioGroup
          value={card.layout}
          onValueChange={(value) =>
            onChange('layout', value as 'standard' | 'text-heavy' | 'utility')
          }
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
          {card.layout === 'standard' && 'Large image with standard text space'}
          {card.layout === 'text-heavy' &&
            'Smaller image with more space for rules text'}
          {card.layout === 'utility' &&
            'Compact card with only name and image - perfect for tokens'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rulesText">Rules Text</Label>
        <Textarea
          id="rulesText"
          value={card.rulesText}
          onChange={(e) => onChange('rulesText', e.target.value)}
          placeholder="Enter card rules text (Markdown supported)"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Supports Markdown: **bold**, *italic*, ~~strikethrough~~, `code`, and
          line breaks
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="flavorText">Flavor Text (Optional)</Label>
        <Textarea
          id="flavorText"
          value={card.flavorText}
          onChange={(e) => onChange('flavorText', e.target.value)}
          placeholder="Enter flavor text"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Card Image</Label>
        <div className="flex items-center gap-4">
          <Label
            htmlFor="image-upload"
            className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-full hover:border-gray-400 transition-colors"
          >
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-6 w-6" />
              <span className="text-sm text-muted-foreground">
                {imageFile ? imageFile.name : 'Upload image'}
              </span>
            </div>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font">Font Style</Label>
        <Select
          value={card.font}
          onValueChange={(value) => onChange('font', value)}
        >
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
  );
}
