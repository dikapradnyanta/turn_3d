// SimpleMode.tsx - Simple mode controls

import React from 'react';
import { Text3DConfig } from '../types';

interface SimpleModeProps {
  config: Text3DConfig;
  onChange: (config: Text3DConfig) => void;
}

const SimpleMode: React.FC<SimpleModeProps> = ({ config, onChange }) => {
  const updateSimple = (updates: Partial<Text3DConfig['simple']>) => {
    onChange({
      ...config,
      simple: { ...config.simple, ...updates }
    });
  };

  // Convert hue to hex color for preview
  const hueToColor = (hue: number): string => {
    const h = hue / 60;
    const c = 1;
    const x = c * (1 - Math.abs((h % 2) - 1));
    
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 1) { r = c; g = x; b = 0; }
    else if (h >= 1 && h < 2) { r = x; g = c; b = 0; }
    else if (h >= 2 && h < 3) { r = 0; g = c; b = x; }
    else if (h >= 3 && h < 4) { r = 0; g = x; b = c; }
    else if (h >= 4 && h < 5) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div>
      {/* Hue Slider */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
          Color Hue: {config.simple.baseHue}°
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            min="0"
            max="360"
            value={config.simple.baseHue}
            onChange={(e) => updateSimple({ baseHue: parseInt(e.target.value) })}
            style={{ 
              flex: 1,
              height: '8px',
              background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
              borderRadius: '4px',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none'
            }}
          />
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: hueToColor(config.simple.baseHue),
              border: '2px solid #e0e0e0'
            }}
          />
        </div>
      </div>

      {/* Depth Slider */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
          Depth Layers: {config.simple.depth}
        </label>
        <input
          type="range"
          min="5"
          max="50"
          value={config.simple.depth}
          onChange={(e) => updateSimple({ depth: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '10px', 
          color: '#999',
          marginTop: '4px'
        }}>
          <span>Thin (5)</span>
          <span>Thick (50)</span>
        </div>
      </div>

      {/* Info */}
      <div style={{
        padding: '12px',
        background: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666',
        lineHeight: '1.4'
      }}>
        <strong>Simple Mode:</strong> Adjust the color hue to shift all colors while maintaining the 3D effect. More depth layers create a thicker appearance.
      </div>
    </div>
  );
};

export default SimpleMode;