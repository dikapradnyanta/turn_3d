// colorUtils.ts - Color manipulation utilities

export interface RGB {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-1
  l: number; // 0-1
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function rgbToHsl(rgb: RGB): HSL {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rgb.r:
        h = ((rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0)) / 6;
        break;
      case rgb.g:
        h = ((rgb.b - rgb.r) / d + 2) / 6;
        break;
      case rgb.b:
        h = ((rgb.r - rgb.g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, l };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s;
  const l = hsl.l;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r, g, b };
}

export function shiftHue(hexColor: string, hueShift: number): string {
  const rgb = hexToRgb(hexColor);
  const hsl = rgbToHsl(rgb);
  
  // Shift hue, keep saturation and lightness
  hsl.h = (hsl.h + hueShift) % 360;
  if (hsl.h < 0) hsl.h += 360;
  
  const newRgb = hslToRgb(hsl);
  return rgbToHex(newRgb);
}

export function interpolateColor(color1: string, color2: string, t: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const interpolated: RGB = {
    r: rgb1.r + (rgb2.r - rgb1.r) * t,
    g: rgb1.g + (rgb2.g - rgb1.g) * t,
    b: rgb1.b + (rgb2.b - rgb1.b) * t,
  };
  
  return rgbToHex(interpolated);
}

// Generate color ramp for depth layers
export function generateColorRamp(baseHue: number, steps: number): string[] {
  const colors: string[] = [];
  
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    
    // Start bright, end darker
    const lightness = 0.6 - (t * 0.3); // 0.6 -> 0.3
    const saturation = 0.7 - (t * 0.2); // 0.7 -> 0.5
    
    const hsl: HSL = {
      h: baseHue,
      s: saturation,
      l: lightness
    };
    
    const rgb = hslToRgb(hsl);
    colors.push(rgbToHex(rgb));
  }
  
  return colors;
}