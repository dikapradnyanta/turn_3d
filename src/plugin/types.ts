// types.ts - Core data models

export type Direction3D = 'down-right' | 'down' | 'down-left' | 'right' | 'left';
export type StylePreset = 'classic' | 'neon' | 'metallic' | 'comic' | 'retro' | 'candy';

export interface Text3DConfig {
  version: string;
  text: {
    content: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    letterSpacing: number;
    lineHeight: number;
  };
  
  mode: 'simple' | 'advanced';
  baseNodeId?: string;
  isGraphic?: boolean;
  
  // Simple mode
  simple: {
    baseHue: number; // 0-360
    depth: number; // jumlah layers
    direction: Direction3D;
    stylePreset: StylePreset;
    offsetX: number; // per-layer offset X
    offsetY: number; // per-layer offset Y
    depthBlur?: number; // for anti-aliasing
  };
  
  // Advanced mode
  advanced: {
    highlightTop: {
      strokeColor: string;
      strokeWidth: number;
      fillGradient: {
        type: 'linear' | 'radial';
        stops: Array<{ position: number; color: string }>;
      };
    };
    
    body: {
      depthLayers: number;
      offsetX: number;
      offsetY: number;
      colorRamp: {
        type: 'linear' | 'radial';
        stops: Array<{ position: number; color: string }>;
      };
      unionMode: boolean;
      depthBlur?: number;
    };
    
    shadowBottom: {
      layers: number;
      maxBlur: number;
      maxOpacity: number;
      color: string;
    };
    
    glow: {
      enabled: boolean;
      intensity: number;
      color: string;
      blur: number;
    };
  };
}

export interface Preset {
  id: string;
  name: string;
  config: Text3DConfig;
}

export const DEFAULT_CONFIG: Text3DConfig = {
  version: '1.0.0',
  text: {
    content: 'TEXT',
    fontFamily: 'Inter',
    fontSize: 120,
    fontWeight: 'Bold',
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  mode: 'simple',
  simple: {
    baseHue: 220,
    depth: 20,
    direction: 'down-right',
    stylePreset: 'classic',
    offsetX: 1,
    offsetY: 2,
    depthBlur: 0.5,
  },
  advanced: {
    highlightTop: {
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
      fillGradient: {
        type: 'linear',
        stops: [
          { position: 0, color: '#FFFFFF' },
          { position: 1, color: '#E0E0E0' }
        ]
      }
    },
    body: {
      depthLayers: 20,
      offsetX: 0,
      offsetY: 2,
      colorRamp: {
        type: 'linear',
        stops: [
          { position: 0, color: '#3B82F6' },
          { position: 1, color: '#1E40AF' }
        ]
      },
      unionMode: false,
      depthBlur: 1
    },
    shadowBottom: {
      layers: 6,
      maxBlur: 40,
      maxOpacity: 0.6,
      color: '#000000'
    },
    glow: {
      enabled: false,
      intensity: 0.5,
      color: '#3B82F6',
      blur: 20
    }
  }
};

export interface PluginMessage {
  type: 'generate' | 'update' | 'preview' | 'load-config' | 'save-preset' | 'load-preset' | 'delete-preset' | 'get-presets';
  config?: Text3DConfig;
  preset?: Preset;
  presetId?: string;
}

export interface UIMessage {
  type: 'config-loaded' | 'generation-complete' | 'error' | 'presets-loaded';
  config?: Text3DConfig;
  presets?: Preset[];
  error?: string;
  isExisting?: boolean;
}