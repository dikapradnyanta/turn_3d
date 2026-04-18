// generator.ts - Core 3D text generation logic (FIXED + ENHANCED)

import { Text3DConfig, StylePreset } from './types';
import { hexToRgb, generateColorRamp, hslToRgb, rgbToHex } from './colorUtils';
import { savePluginData } from './detector';

// Clamp value to [0, 1]
function clamp(val: number): number {
  return Math.max(0, Math.min(1, val));
}

// Function to recursively tint any node (for graphic extrusion)
function tintNode(node: SceneNode, hexColor: string, isTopLayer: boolean = false) {
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = [...node.fills as Paint[]];
    const rgb = hexToRgb(hexColor);
    
    if (isTopLayer) {
      // Don't tint the top layer if it's an image, or we might overwrite it, 
      // but if the user wants classic text, we might overide. Let's just append an overlay for generic nodes.
      // Wait, top layer gradient is complex. Let's just apply solid tint for simple generic 3D.
    } else {
      // For depth layers, we apply a solid fill overlay to turn it into a 3D side.
      fills.push({
        type: 'SOLID',
        blendMode: 'NORMAL',
        color: { r: clamp(rgb.r), g: clamp(rgb.g), b: clamp(rgb.b) }
      });
      node.fills = fills;
    }
  }
  
  if ('children' in node) {
    for (const child of node.children) {
      tintNode(child as SceneNode, hexColor, isTopLayer);
    }
  }
}

// Helper to recursively update text content if node contains text
export async function updateTextContent(node: SceneNode, config: Text3DConfig) {
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    // For every text node we find, load its current font AND the new config font to be safe
    if (textNode.fontName !== figma.mixed) {
      await figma.loadFontAsync(textNode.fontName as FontName);
    }
    await figma.loadFontAsync({ family: config.text.fontFamily, style: config.text.fontWeight });
    
    textNode.characters = config.text.content;
    textNode.fontName = { family: config.text.fontFamily, style: config.text.fontWeight };
    textNode.fontSize = config.text.fontSize;
  } else if ('children' in node) {
    for (const child of node.children) {
      await updateTextContent(child as SceneNode, config);
    }
  }
}

// Helper to apply effects safely
function appendEffect(node: SceneNode, effect: Effect) {
  const nodeWithEffects = node as any;
  if ('effects' in nodeWithEffects && nodeWithEffects.effects !== figma.mixed) {
    nodeWithEffects.effects = [...nodeWithEffects.effects, effect];
  } else if ('children' in node) {
    for (const child of node.children) {
      appendEffect(child as SceneNode, effect);
    }
  }
}

// === STYLE PRESET DEFINITIONS ===
interface StyleDef {
  lightness: [number, number];  // top, bottom
  saturation: [number, number]; // top, bottom
  topGradient: [string, string];
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  glowEnabled: boolean;
  glowBlur: number;
  glowIntensity: number;
  shadowOpacity: number;
}

function getStyleDef(preset: StylePreset, baseHue: number): StyleDef {
  switch (preset) {
    case 'neon':
      return {
        lightness:    [0.55, 0.25],
        saturation:   [1.0,  0.9],
        topGradient:  [
          rgbToHex(hslToRgb({ h: baseHue, s: 1.0, l: 0.75 })),
          rgbToHex(hslToRgb({ h: baseHue, s: 1.0, l: 0.55 })),
        ],
        strokeColor:  rgbToHex(hslToRgb({ h: baseHue, s: 1.0, l: 0.85 })),
        strokeWidth:  3,
        shadowColor:  rgbToHex(hslToRgb({ h: baseHue, s: 0.9, l: 0.3 })),
        glowEnabled:  true,
        glowBlur:     30,
        glowIntensity: 0.8,
        shadowOpacity: 0.7,
      };

    case 'metallic':
      return {
        lightness:    [0.8, 0.35],
        saturation:   [0.1, 0.2],
        topGradient:  ['#F5F5F5', '#C0A060'],
        strokeColor:  '#D4AF37',
        strokeWidth:  2,
        shadowColor:  '#1a1a00',
        glowEnabled:  false,
        glowBlur:     0,
        glowIntensity: 0,
        shadowOpacity: 0.6,
      };

    case 'comic':
      return {
        lightness:    [0.65, 0.4],
        saturation:   [0.9,  0.8],
        topGradient:  [
          rgbToHex(hslToRgb({ h: baseHue, s: 0.9, l: 0.8 })),
          rgbToHex(hslToRgb({ h: baseHue, s: 0.9, l: 0.60 })),
        ],
        strokeColor:  '#111111',
        strokeWidth:  5,
        shadowColor:  '#000000',
        glowEnabled:  false,
        glowBlur:     0,
        glowIntensity: 0,
        shadowOpacity: 0.9,
      };

    case 'retro':
      return {
        lightness:    [0.65, 0.30],
        saturation:   [0.6,  0.5],
        topGradient:  [
          rgbToHex(hslToRgb({ h: 35, s: 0.7, l: 0.75 })),
          rgbToHex(hslToRgb({ h: 20, s: 0.7, l: 0.50 })),
        ],
        strokeColor:  rgbToHex(hslToRgb({ h: 25, s: 0.5, l: 0.35 })),
        strokeWidth:  2,
        shadowColor:  '#3D1C00',
        glowEnabled:  false,
        glowBlur:     0,
        glowIntensity: 0,
        shadowOpacity: 0.55,
      };

    case 'candy':
      return {
        lightness:    [0.80, 0.45],
        saturation:   [0.85, 0.75],
        topGradient:  [
          rgbToHex(hslToRgb({ h: baseHue, s: 0.85, l: 0.88 })),
          rgbToHex(hslToRgb({ h: (baseHue + 30) % 360, s: 0.8, l: 0.68 })),
        ],
        strokeColor:  '#ffffff',
        strokeWidth:  2,
        shadowColor:  rgbToHex(hslToRgb({ h: baseHue, s: 0.6, l: 0.35 })),
        glowEnabled:  true,
        glowBlur:     15,
        glowIntensity: 0.4,
        shadowOpacity: 0.4,
      };

    case 'classic':
    default:
      return {
        lightness:    [0.60, 0.30],
        saturation:   [0.7,  0.5],
        topGradient:  ['#ffffff', rgbToHex(hslToRgb({ h: baseHue, s: 0.8, l: 0.75 }))],
        strokeColor:  '#ffffff',
        strokeWidth:  2,
        shadowColor:  '#000000',
        glowEnabled:  false,
        glowBlur:     0,
        glowIntensity: 0,
        shadowOpacity: 0.4,
      };
  }
}

// === MAIN GENERATOR ===
export async function generate3DText(config: Text3DConfig, existingNode?: GroupNode, isPreview: boolean = false): Promise<GroupNode> {
  // Simpan posisi dari node yang ada (existing/selected)
  let savedX = 0;
  let savedY = 0;
  let hasPosition = false;
  let baseNode: SceneNode;
  let targetParent: BaseNode & ChildrenMixin = figma.currentPage;

  if (existingNode) {
    savedX = existingNode.x;
    savedY = existingNode.y;
    hasPosition = true;
    if (existingNode.parent) {
      targetParent = existingNode.parent;
    }
    
    // Extract the original top layer from the generated group
    const childrenCount = existingNode.children.length;
    if (childrenCount > 0) {
      // The top layer was pushed last into the group
      baseNode = existingNode.children[childrenCount - 1];
      figma.currentPage.appendChild(baseNode); // Detach from group
      // Clean up the rest
      existingNode.remove();
    } else {
      throw new Error("Group is empty.");
    }
  } else {
    // First time generating from a raw selection
    var sel = figma.currentPage.selection;
    if (sel.length === 1) {
      baseNode = sel[0];
      savedX = baseNode.x;
      savedY = baseNode.y;
      hasPosition = true;
      if (baseNode.parent) {
        targetParent = baseNode.parent;
      }
    } else {
      throw new Error("Please select a single node or generated 3D object to update.");
    }
  }

  // Update text elements to the requested text and font in the UI, if the UI dictates it
  // (We do this BEFORE cloning so depth layers naturally match the updated text)
  if (!config.isGraphic && config.text.content.trim().length > 0) {
    await updateTextContent(baseNode, config);
  }

  // Generate based on mode — collect all layers
  let allNodes: SceneNode[];
  if (config.mode === 'simple') {
    allNodes = await generateSimpleMode(config, baseNode);
  } else {
    allNodes = await generateAdvancedMode(config, baseNode);
  }

  // Now create group with all nodes (fix: no empty group)
  if (allNodes.length === 0) {
    throw new Error('No nodes were generated. Please check font settings.');
  }

  var rootGroup = figma.group(allNodes, targetParent as BaseNode & ChildrenMixin);
  rootGroup.name = "3D_TEXT_" + (config.text.content || "GRAPHIC");

  // Pindahkan group ke posisi yang tersimpan
  if (hasPosition) {
    rootGroup.x = savedX;
    rootGroup.y = savedY;
  }

  // Save config to plugin data
  savePluginData(rootGroup, config);

  // Select the result
  figma.currentPage.selection = [rootGroup];
  figma.viewport.scrollAndZoomIntoView([rootGroup]);

  return rootGroup;
}

// === SIMPLE MODE ===
async function generateSimpleMode(config: Text3DConfig, baseNode: SceneNode): Promise<SceneNode[]> {
  const { baseHue, depth } = config.simple;
  const direction = config.simple.direction ? config.simple.direction : 'down-right';
  const preset = config.simple.stylePreset ? config.simple.stylePreset : 'classic';

  const styleDef = getStyleDef(preset, baseHue);

  // Calculate per-layer offset from direction
  const offsetX = config.simple.offsetX !== undefined && config.simple.offsetX !== null ? config.simple.offsetX : 1;
  const offsetY = config.simple.offsetY !== undefined && config.simple.offsetY !== null ? config.simple.offsetY : 2;

  const layers: SceneNode[] = [];
  const blurRadius = config.simple.depthBlur || 0;

  // Create depth layers (bottom to top ordering in array)
  for (let i = depth - 1; i >= 0; i--) {
    let layerNode = baseNode.clone();
    layerNode.visible = true;

    // Position based on direction
    layerNode.x = baseNode.x + (i * offsetX);
    layerNode.y = baseNode.y + (i * offsetY);

    // Color: interpolate from dark (bottom) to light (top)
    const t = i / Math.max(depth - 1, 1);
    const lightness = styleDef.lightness[1] + (styleDef.lightness[0] - styleDef.lightness[1]) * (1 - t);
    const saturation = styleDef.saturation[1] + (styleDef.saturation[0] - styleDef.saturation[1]) * (1 - t);

    const rgb = hslToRgb({ h: baseHue, s: saturation, l: lightness });
    const hexColor = rgbToHex(rgb);
    
    tintNode(layerNode, hexColor, false);
    
    if (blurRadius > 0) {
      appendEffect(layerNode, { type: 'LAYER_BLUR', radius: blurRadius, visible: true, blurType: 'NORMAL' } as Effect);
    }

    layers.push(layerNode);
  }

  // Push original source node as the top layer
  baseNode.visible = true;
  layers.push(baseNode);

  // Apply shadows to bottom layer
  const shadowRgb = hexToRgb(styleDef.shadowColor);
  const bottomLayer = layers[0] as TextNode;
  const shadowEffects: DropShadowEffect[] = [
    {
      type: 'DROP_SHADOW',
      color: { r: clamp(shadowRgb.r), g: clamp(shadowRgb.g), b: clamp(shadowRgb.b), a: styleDef.shadowOpacity },
      offset: { x: Math.abs(offsetX) * 2, y: Math.abs(offsetY) * 2 },
      radius: 8,
      visible: true,
      blendMode: 'NORMAL',
      spread: 0,
      showShadowBehindNode: false,
    },
    {
      type: 'DROP_SHADOW',
      color: { r: clamp(shadowRgb.r), g: clamp(shadowRgb.g), b: clamp(shadowRgb.b), a: styleDef.shadowOpacity * 0.5 },
      offset: { x: Math.abs(offsetX) * 4, y: Math.abs(offsetY) * 4 },
      radius: 24,
      visible: true,
      blendMode: 'NORMAL',
      spread: 0,
      showShadowBehindNode: false,
    },
  ];
  bottomLayer.effects = shadowEffects;

  // Apply glow if enabled
  if (styleDef.glowEnabled) {
    const glowRgb = hexToRgb(styleDef.topGradient[0]);
    const glowEffect: DropShadowEffect = {
      type: 'DROP_SHADOW',
      color: { r: clamp(glowRgb.r), g: clamp(glowRgb.g), b: clamp(glowRgb.b), a: styleDef.glowIntensity },
      offset: { x: 0, y: 0 },
      radius: styleDef.glowBlur,
      visible: true,
      blendMode: 'NORMAL',
      spread: 0,
      showShadowBehindNode: false,
    };
    appendEffect(baseNode, glowEffect);
  }

  return layers;
}

// === ADVANCED MODE ===
async function generateAdvancedMode(config: Text3DConfig, baseNode: SceneNode): Promise<SceneNode[]> {
  const { advanced, text } = config;

  const layers: SceneNode[] = [];
  const blurRadius = config.advanced.body.depthBlur || 0;

  // 1. Generate Depth Body (bottom to top)
  for (let i = advanced.body.depthLayers - 1; i >= 0; i--) {
    let layerNode = baseNode.clone();
    layerNode.visible = true;

    layerNode.x = baseNode.x + (i * advanced.body.offsetX);
    layerNode.y = baseNode.y + (i * advanced.body.offsetY);

    // Color ramp interpolation
    const t = i / Math.max(advanced.body.depthLayers - 1, 1);
    const stops = advanced.body.colorRamp.stops;
    const colorStart = hexToRgb(stops[0].color);
    const colorEnd = hexToRgb(stops[stops.length - 1].color);
    
    const rInterpolated = clamp(colorStart.r + (colorEnd.r - colorStart.r) * t);
    const gInterpolated = clamp(colorStart.g + (colorEnd.g - colorStart.g) * t);
    const bInterpolated = clamp(colorStart.b + (colorEnd.b - colorStart.b) * t);

    const hexInterpolated = rgbToHex({ r: rInterpolated, g: gInterpolated, b: bInterpolated });
    tintNode(layerNode, hexInterpolated, false);
    
    if (blurRadius > 0) {
      appendEffect(layerNode, { type: 'LAYER_BLUR', radius: blurRadius, visible: true, blurType: 'NORMAL' } as BlurEffect);
    }

    layers.push(layerNode);
  }

  // 2. Output Top Highlight Layer
  baseNode.visible = true;
  layers.push(baseNode);

  // Apply shadows to bottom layer
  const shadowEffects: DropShadowEffect[] = [];
  const numShadows = Math.max(advanced.shadowBottom.layers, 1);
  for (let i = 0; i < numShadows; i++) {
    const t = i / Math.max(numShadows - 1, 1);
    const blur = clamp((advanced.shadowBottom.maxBlur * (t + 0.5)) / 200) * 200;
    const opacity = clamp(advanced.shadowBottom.maxOpacity * (1 - t * 0.5));

    const shadowRgb = hexToRgb(advanced.shadowBottom.color);
    shadowEffects.push({
      type: 'DROP_SHADOW',
      color: { r: clamp(shadowRgb.r), g: clamp(shadowRgb.g), b: clamp(shadowRgb.b), a: opacity },
      offset: { x: 0, y: 4 * (i + 1) },
      radius: blur,
      visible: true,
      blendMode: 'NORMAL',
      spread: 0,
      showShadowBehindNode: false,
    });
  }

  if (layers.length > 0) {
    const bottomLayer = layers[0] as any;
    if ('effects' in bottomLayer) {
      bottomLayer.effects = shadowEffects;
    }
  }

  // Apply glow if enabled
  if (advanced.glow.enabled) {
    const glowRgb = hexToRgb(advanced.glow.color);
    const glowEffect: DropShadowEffect = {
      type: 'DROP_SHADOW',
      color: { r: clamp(glowRgb.r), g: clamp(glowRgb.g), b: clamp(glowRgb.b), a: clamp(advanced.glow.intensity) },
      offset: { x: 0, y: 0 },
      radius: advanced.glow.blur,
      visible: true,
      blendMode: 'NORMAL',
      spread: 0,
      showShadowBehindNode: false,
    };
    appendEffect(baseNode, glowEffect);
  }

  // Append to parent is now handled by caller — return all nodes
  return layers;
}