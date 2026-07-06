export interface ColorSwatch {
  id: string;
  hex: string;
  locked: boolean;
  name?: string;
  reason?: string;
}

export type HarmonyMode = 'random' | 'monochromatic' | 'analogous' | 'complementary' | 'triadic';

export type ViewMode = 'generator' | 'scale' | 'contrast' | 'export' | 'saved';
