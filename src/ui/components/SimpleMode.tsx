// SimpleMode.tsx - Simple mode with Style Presets + Direction Control
import React from 'react';
import { Text3DConfig, StylePreset, Direction3D } from '../../plugin/types';
import { PluginActions } from '../hooks/usePluginState';

interface SimpleModeProps {
  config: Text3DConfig;
  actions: PluginActions;
}

interface StylePresetDef {
  id: StylePreset;
  label: string;
  emoji: string;
  baseHue: number;
  description: string;
  bgColor: string;
  textColor: string;
}

interface DirectionDef {
  id: Direction3D;
  label: string;
  icon: string;
  offsetX: number;
  offsetY: number;
}

const STYLE_PRESETS: StylePresetDef[] = [
  { id: 'classic',  label: 'Classic',   emoji: 'C', baseHue: 220, description: 'Blue depth',      bgColor: '#E8F0FF', textColor: '#0044CC' },
  { id: 'neon',     label: 'Neon',      emoji: 'N', baseHue: 140, description: 'Electric green',  bgColor: '#E8FFE8', textColor: '#006600' },
  { id: 'metallic', label: 'Metallic',  emoji: 'M', baseHue: 40,  description: 'Gold & silver',   bgColor: '#FFF8E8', textColor: '#7A5900' },
  { id: 'comic',    label: 'Comic',     emoji: 'B', baseHue: 50,  description: 'Bold & bright',   bgColor: '#FFFACC', textColor: '#7A6B00' },
  { id: 'retro',    label: 'Retro',     emoji: 'R', baseHue: 25,  description: 'Warm vintage',    bgColor: '#FFF0E8', textColor: '#7A2F00' },
  { id: 'candy',    label: 'Candy',     emoji: 'P', baseHue: 310, description: 'Pink pastel',     bgColor: '#FFE8FF', textColor: '#660066' },
];

const DIRECTIONS: DirectionDef[] = [
  { id: 'down-right', label: 'Down-Right', icon: '↘', offsetX: 1,  offsetY: 2  },
  { id: 'down',       label: 'Down',       icon: '↓', offsetX: 0,  offsetY: 2  },
  { id: 'down-left',  label: 'Down-Left',  icon: '↙', offsetX: -1, offsetY: 2  },
  { id: 'right',      label: 'Right',      icon: '→', offsetX: 2,  offsetY: 0  },
  { id: 'left',       label: 'Left',       icon: '←', offsetX: -2, offsetY: 0  },
];

const hueToColor = (hue: number, lightness = 0.55): string => {
  // HSL to rough hex for preview
  const h = hue / 60;
  const s = 0.8;
  const l = lightness;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 1)      { r = c; g = x; b = 0; }
  else if (h >= 1 && h < 2) { r = x; g = c; b = 0; }
  else if (h >= 2 && h < 3) { r = 0; g = c; b = x; }
  else if (h >= 3 && h < 4) { r = 0; g = x; b = c; }
  else if (h >= 4 && h < 5) { r = x; g = 0; b = c; }
  else                       { r = c; g = 0; b = x; }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const SimpleMode: React.FC<SimpleModeProps> = ({ config, actions }) => {
  const activePreset = config.simple.stylePreset || 'classic';
  const activeDirection = config.simple.direction || 'down-right';

  const handlePresetSelect = (preset: StylePresetDef) => {
    actions.updateSimple({
      stylePreset: preset.id,
      baseHue: preset.baseHue,
    });
  };

  const handleDirectionSelect = (dir: DirectionDef) => {
    actions.updateSimple({
      direction: dir.id,
      offsetX: dir.offsetX,
      offsetY: dir.offsetY,
    });
  };

  return (
    <div>
      {/* === STYLE PRESETS === */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '700',
          fontSize: '11px',
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Style Preset
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}>
          {STYLE_PRESETS.map((preset) => {
            const isActive = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                title={preset.description}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  background: isActive ? preset.bgColor : '#FFFFFF',
                  border: isActive ? `1px solid ${preset.textColor}` : '1px solid #E5E5E5',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 1px 3px rgba(0,0,0,0.1)` : 'none',
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: hueToColor(preset.baseHue) }} />
                <div>
                  <div style={{ fontWeight: '600', color: preset.textColor, fontSize: '11px' }}>{preset.label}</div>
                  <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>{preset.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* === 3D DIRECTION === */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '11px', color: '#333' }}>
          3D Direction
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '4px' }}>
          {DIRECTIONS.map((dir) => {
            const isActive = activeDirection === dir.id;
            return (
              <button
                key={dir.id}
                onClick={() => handleDirectionSelect(dir)}
                style={{
                  padding: '8px 4px',
                  background: isActive ? '#0066FF' : '#f8f8f8',
                  border: `1px solid ${isActive ? '#0066FF' : '#e8e8e8'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: isActive ? 'white' : '#444',
                  fontWeight: '600',
                }}
              >
                {dir.icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* === COLOR HUE === */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '11px', color: '#333' }}>
          Depth Color Hue: <span style={{ color: '#0066FF' }}>{config.simple.baseHue}°</span>
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={config.simple.baseHue}
          onChange={(e) => actions.updateSimple({ baseHue: parseInt(e.target.value) })}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      {/* === DEPTH LENGTH === */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontWeight: '600', fontSize: '11px', color: '#333' }}>
            Extrusion Depth
          </label>
          <span style={{ color: '#666', fontSize: '11px' }}>{config.simple.depth}px</span>
        </div>
        <input
          type="range"
          min="5"
          max="50"
          value={config.simple.depth}
          onChange={(e) => actions.updateSimple({ depth: parseInt(e.target.value) })}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      {/* === DEPTH BLUR (SMOOTHNESS) === */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontWeight: '600', fontSize: '11px', color: '#333' }}>
            Smoothness (Edge Blur)
          </label>
          <span style={{ color: '#666', fontSize: '11px' }}>{config.simple.depthBlur || 0}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={config.simple.depthBlur || 0}
          onChange={(e) => actions.updateSimple({ depthBlur: parseFloat(e.target.value) })}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default SimpleMode;