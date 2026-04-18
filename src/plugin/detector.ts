/// <reference types="@figma/plugin-typings" />

// detector.ts - Detect if selected group is plugin-generated or looks like 3D text

import { Text3DConfig } from './types';

const PLUGIN_DATA_KEY = '3d-text-generator';

export function savePluginData(node: GroupNode, config: Text3DConfig): void {
  node.setPluginData(PLUGIN_DATA_KEY, JSON.stringify(config));
}

export function loadPluginData(node: SceneNode): Text3DConfig | null {
  if (node.type !== 'GROUP') return null;
  
  const data = node.getPluginData(PLUGIN_DATA_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse plugin data:', e);
    return null;
  }
}

export function isPluginGenerated(node: SceneNode): boolean {
  if (node.type !== 'GROUP') return false;
  const data = node.getPluginData(PLUGIN_DATA_KEY);
  return !!data;
}

// Pattern matching for manually created 3D text
export function looksLike3DText(node: SceneNode): boolean {
  if (node.type !== 'GROUP') return false;
  
  const group = node as GroupNode;
  const children = group.children;
  
  // Need at least 5 layers to be considered 3D text
  if (children.length < 5) return false;
  
  // Count text layers
  const textLayers = children.filter(n => n.type === 'TEXT') as TextNode[];
  if (textLayers.length < 5) return false;
  
  // Check if all text layers have same content
  const firstContent = textLayers[0].characters;
  const sameContent = textLayers.every(t => t.characters === firstContent);
  
  if (!sameContent) return false;
  
  // Check if positions have consistent offset
  const offsets = textLayers.slice(1).map((t, i) => ({
    x: t.x - textLayers[i].x,
    y: t.y - textLayers[i].y
  }));
  
  // Check consistency of offsets (should be similar)
  if (offsets.length < 2) return true; // Too few to judge
  
  const avgOffsetX = offsets.reduce((sum, o) => sum + o.x, 0) / offsets.length;
  const avgOffsetY = offsets.reduce((sum, o) => sum + o.y, 0) / offsets.length;
  
  const variance = offsets.reduce((sum, o) => {
    const dx = o.x - avgOffsetX;
    const dy = o.y - avgOffsetY;
    return sum + dx * dx + dy * dy;
  }, 0) / offsets.length;
  
  // If variance is low, offsets are consistent
  return variance < 10; // Tolerance threshold
}

export interface DetectionResult {
  type: 'plugin-generated' | 'looks-like-3d' | 'not-3d' | 'no-selection' | 'base-node';
  config?: Text3DConfig;
  node?: GroupNode;
  baseNode?: SceneNode;
}

export function detectSelection(): DetectionResult {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    return { type: 'no-selection' };
  }
  
  if (selection.length > 1) {
    return { type: 'no-selection' };
  }
  
  const node = selection[0];
  
  // Check if plugin generated
  const config = loadPluginData(node);
  if (config && node.type === 'GROUP') {
    return {
      type: 'plugin-generated',
      config,
      node: node as GroupNode
    };
  }
  
  // Check if looks like 3D text
  if (looksLike3DText(node)) {
    return {
      type: 'looks-like-3d',
      node: node as GroupNode
    };
  }
  
  // If it's a valid single node, offer to use it as base!
  return { 
    type: 'base-node',
    baseNode: node
  };
}