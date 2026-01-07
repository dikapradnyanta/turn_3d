// generator.ts - Core 3D text generation logic
import { Text3DConfig } from './types';
import { hexToRgb, generateColorRamp, shiftHue, interpolateColor } from './colorUtils';
import { savePluginData } from './detector';

export async function generate3DText(config: Text3DConfig, existingNode?: GroupNode): Promise<GroupNode> {
  // Load font
  await figma.loadFontAsync({
    family: config.text.fontFamily,
    style: config.text.fontWeight
  });
  
  // Delete existing node if updating
  if (existingNode) {
    existingNode.remove();
  }
  
  // Create root group
  const rootGroup = figma.group([], figma.currentPage);
  rootGroup.name = `3D_TEXT_${config.text.content}`;
  
  // Generate based on mode
  if (config.mode === 'simple') {
    await generateSimpleMode(rootGroup, config);
  } else {
    await generateAdvancedMode(rootGroup, config);
  }
  
  // Save config to plugin data
  savePluginData(rootGroup, config);
  
  // Select the result
  figma.currentPage.selection = [rootGroup];
  figma.viewport.scrollAndZoomIntoView([rootGroup]);
  
  return rootGroup;
}

async function generateSimpleMode(parent: GroupNode, config: Text3DConfig): Promise<void> {
  const { baseHue, depth } = config.simple;
  const { content, fontSize, fontFamily, fontWeight } = config.text;
  
  // Generate color ramp
  const colors = generateColorRamp(baseHue, depth);
  
  const layers: SceneNode[] = [];
  
  // Create depth layers (bottom to top)
  for (let i = depth - 1; i >= 0; i--) {
    const textNode = figma.createText();
    textNode.fontName = { family: fontFamily, style: fontWeight };
    textNode.fontSize = fontSize;
    textNode.characters = content;
    
    // Position
    textNode.x = i * 0;
    textNode.y = i * 2;
    
    // Color
    const color = hexToRgb(colors[i]);
    textNode.fills = [{
      type: 'SOLID',
      color: { r: color.r, g: color.g, b: color.b }
    }];
    
    layers.push(textNode);
  }
  
  // Create highlight top layer
  const topLayer = figma.createText();
  topLayer.fontName = { family: fontFamily, style: fontWeight };
  topLayer.fontSize = fontSize;
  topLayer.characters = content;
  topLayer.x = 0;
  topLayer.y = 0;
  
  // Bright color for top
  const topColor = hexToRgb(shiftHue(colors[0], 0));
  topLayer.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [
      [1, 0, 0],
      [0, 1, 0]
    ],
    gradientStops: [
      { position: 0, color: { r: 1, g: 1, b: 1 } },
      { position: 1, color: { r: topColor.r * 1.2, g: topColor.g * 1.2, b: topColor.b * 1.2 } }
    ]
  }];
  
  // Add stroke
  topLayer.strokes = [{
    type: 'SOLID',
    color: { r: 1, g: 1, b: 1 }
  }];
  topLayer.strokeWeight = 2;
  
  layers.push(topLayer);
  
  // Add shadow to bottom layer
  const bottomLayer = layers[0] as TextNode;
  bottomLayer.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.4 },
      offset: { x: 0, y: 4 },
      radius: 8,
      visible: true,
      blendMode: 'NORMAL'
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.3 },
      offset: { x: 0, y: 8 },
      radius: 16,
      visible: true,
      blendMode: 'NORMAL'
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.2 },
      offset: { x: 0, y: 12 },
      radius: 24,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];
  
  // Append to parent
  layers.forEach(layer => parent.appendChild(layer));
}

async function generateAdvancedMode(parent: GroupNode, config: Text3DConfig): Promise<void> {
  const { advanced, text } = config;
  const { content, fontSize, fontFamily, fontWeight } = text;
  
  const layers: SceneNode[] = [];
  
  // Create body depth layers
  for (let i = advanced.body.depthLayers - 1; i >= 0; i--) {
    const textNode = figma.createText();
    textNode.fontName = { family: fontFamily, style: fontWeight };
    textNode.fontSize = fontSize;
    textNode.characters = content;
    
    // Position with offset
    textNode.x = i * advanced.body.offsetX;
    textNode.y = i * advanced.body.offsetY;
    
    // Color interpolation
    const t = i / (advanced.body.depthLayers - 1);
    const stops = advanced.body.colorRamp.stops;
    const color = interpolateColor(stops[0].color, stops[stops.length - 1].color, t);
    const rgb = hexToRgb(color);
    
    textNode.fills = [{
      type: 'SOLID',
      color: { r: rgb.r, g: rgb.g, b: rgb.b }
    }];
    
    layers.push(textNode);
  }
  
  // Create highlight top
  const topLayer = figma.createText();
  topLayer.fontName = { family: fontFamily, style: fontWeight };
  topLayer.fontSize = fontSize;
  topLayer.characters = content;
  topLayer.x = 0;
  topLayer.y = 0;
  
  // Apply gradient from config
  const gradStops = advanced.highlightTop.fillGradient.stops;
  topLayer.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [
      [1, 0, 0],
      [0, 1, 0]
    ],
    gradientStops: gradStops.map(stop => {
      const rgb = hexToRgb(stop.color);
      return {
        position: stop.position,
        color: { r: rgb.r, g: rgb.g, b: rgb.b }
      };
    })
  }];
  
  // Apply stroke
  const strokeRgb = hexToRgb(advanced.highlightTop.strokeColor);
  topLayer.strokes = [{
    type: 'SOLID',
    color: { r: strokeRgb.r, g: strokeRgb.g, b: strokeRgb.b }
  }];
  topLayer.strokeWeight = advanced.highlightTop.strokeWidth;
  
  layers.push(topLayer);
  
  // Apply shadows
  const shadowEffects: Effect[] = [];
  for (let i = 0; i < advanced.shadowBottom.layers; i++) {
    const t = i / (advanced.shadowBottom.layers - 1);
    const blur = advanced.shadowBottom.maxBlur * (t + 0.5);
    const opacity = advanced.shadowBottom.maxOpacity * (1 - t * 0.5);
    
    const shadowRgb = hexToRgb(advanced.shadowBottom.color);
    
    shadowEffects.push({
      type: 'DROP_SHADOW',
      color: { r: shadowRgb.r, g: shadowRgb.g, b: shadowRgb.b, a: opacity },
      offset: { x: 0, y: 4 * (i + 1) },
      radius: blur,
      visible: true,
      blendMode: 'NORMAL'
    });
  }
  
  if (layers.length > 0) {
    (layers[0] as TextNode).effects = shadowEffects;
  }
  
  // Apply glow if enabled
  if (advanced.glow.enabled) {
    const glowRgb = hexToRgb(advanced.glow.color);
    const glowEffect: Effect = {
      type: 'DROP_SHADOW',
      color: { r: glowRgb.r, g: glowRgb.g, b: glowRgb.b, a: advanced.glow.intensity },
      offset: { x: 0, y: 0 },
      radius: advanced.glow.blur,
      visible: true,
      blendMode: 'NORMAL'
    };
    
    topLayer.effects = [glowEffect];
  }
  
  // Append to parent
  layers.forEach(layer => parent.appendChild(layer));
  
  // Union if requested
  if (advanced.body.unionMode && layers.length > 1) {
    const bodyLayers = layers.slice(0, -1); // All except top layer
    if (bodyLayers.every(l => l.type === 'TEXT')) {
      const union = figma.union(bodyLayers as VectorNode[], parent);
      union.name = 'Body_Union';
    }
  }
}