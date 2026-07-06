import chroma from 'chroma-js';
import { ColorSwatch, HarmonyMode } from '../types';

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const generateRandomHex = () => chroma.random().hex();

export const generatePalette = (
  currentPalette: ColorSwatch[],
  mode: HarmonyMode = 'random',
): ColorSwatch[] => {
  const newPalette = [...currentPalette];
  
  if (mode === 'random') {
    return newPalette.map(swatch => 
      swatch.locked ? swatch : { ...swatch, hex: generateRandomHex() }
    );
  }

  const lockedColors = currentPalette.filter(s => s.locked);
  const baseColorHex = lockedColors.length > 0 ? lockedColors[0].hex : generateRandomHex();
  const baseChroma = chroma(baseColorHex);
  
  let generatedColors: string[] = [];

  switch (mode) {
    case 'complementary':
      generatedColors = [
        baseChroma.hex(),
        baseChroma.set('hsl.l', '+0.1').hex(),
        baseChroma.set('hsl.h', '+180').set('hsl.s', '+0.1').hex(),
        baseChroma.set('hsl.h', '+180').set('hsl.l', '-0.1').hex(),
        baseChroma.set('hsl.h', '+180').set('hsl.l', '-0.2').hex(),
      ];
      break;
    case 'analogous':
       generatedColors = [
        baseChroma.set('hsl.h', '-60').hex(),
        baseChroma.set('hsl.h', '-30').hex(),
        baseChroma.hex(),
        baseChroma.set('hsl.h', '+30').hex(),
        baseChroma.set('hsl.h', '+60').hex(),
      ];
      break;
    case 'triadic':
      generatedColors = [
        baseChroma.set('hsl.h', '-120').hex(),
        baseChroma.set('hsl.l', '+0.1').hex(),
        baseChroma.hex(),
        baseChroma.set('hsl.h', '+120').hex(),
        baseChroma.set('hsl.h', '+120').set('hsl.l', '-0.1').hex(),
      ];
      break;
    case 'monochromatic':
       generatedColors = chroma.scale([baseChroma.set('hsl.l', 0.2), baseChroma, baseChroma.set('hsl.l', 0.9)]).colors(5);
       break;
    default:
       generatedColors = Array.from({length: 5}, generateRandomHex);
  }

  let genIndex = 0;
  return newPalette.map((swatch) => {
    if (swatch.locked) {
        // Skip locked colors in generation scheme if we wanted to be perfectly true to the harmony, 
        // but for now, we just map the generated colors around the locked ones.
        return swatch;
    }
    const nextColor = generatedColors[genIndex % generatedColors.length] || generateRandomHex();
    genIndex++;
    return { ...swatch, hex: nextColor };
  });
};

export const getContrastColor = (hex: string) => {
  if (!chroma.valid(hex)) return '#ffffff';
  return chroma.contrast(hex, '#ffffff') > 4.5 ? '#ffffff' : '#000000';
};

export const getColorScale = (hex: string) => {
    if (!chroma.valid(hex)) return [];
    const base = chroma(hex);
    const scale = chroma.scale([
        base.set('hsl.l', 0.95), 
        base, 
        base.set('hsl.l', 0.1)
    ]).mode('lrgb').colors(11);
    
    return [
       { stop: '50', hex: scale[0] },
       { stop: '100', hex: scale[1] },
       { stop: '200', hex: scale[2] },
       { stop: '300', hex: scale[3] },
       { stop: '400', hex: scale[4] },
       { stop: '500', hex: scale[5] },
       { stop: '600', hex: scale[6] },
       { stop: '700', hex: scale[7] },
       { stop: '800', hex: scale[8] },
       { stop: '900', hex: scale[9] },
       { stop: '950', hex: scale[10] },
    ];
};

export const getContrastRatio = (hex1: string, hex2: string) => {
    if (!chroma.valid(hex1) || !chroma.valid(hex2)) return 0;
    return chroma.contrast(hex1, hex2);
}
