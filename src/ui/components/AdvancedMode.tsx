// ui/components/AdvancedMode.tsx
import React, { useState } from 'react';
import { Text3DConfig } from '../../plugin/types';
import { PluginActions } from '../hooks/usePluginState';

interface AdvancedModeProps {
  config: Text3DConfig;
  actions: PluginActions;  // ← FIXED: pakai actions bukan onChange
}

const AdvancedMode: React.FC<AdvancedModeProps> = ({ config, actions }) => {
  const [expandedSection, setExpandedSection] = useState<string>('body');

  const updateAdvanced = (section: keyof Text3DConfig['advanced'], updates: any) => {
    actions.updateAdvanced(section, updates);  // ← FIXED: pakai actions.updateAdvanced
  };

  const Section: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => (
    <div style={{ marginBottom: '12px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      <div
        onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
        style={{
          padding: '10px 12px',
          background: '#f8f8f8',
          cursor: 'pointer',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {title}
        <span>{expandedSection === id ? '▼' : '▶'}</span>
      </div>
      {expandedSection === id && (
        <div style={{ padding: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '16px' }}>
      {/* Body Settings */}
      <Section title="Body Settings" id="body">
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            Depth Layers: {config.advanced.body.depthLayers}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={config.advanced.body.depthLayers}
            onChange={(e) => updateAdvanced('body', { depthLayers: parseInt(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            Offset Y: {config.advanced.body.offsetY}px
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={config.advanced.body.offsetY}
            onChange={(e) => updateAdvanced('body', { offsetY: parseFloat(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            Start Color
          </label>
          <input
            type="color"
            value={config.advanced.body.colorRamp.stops[0].color}
            onChange={(e) => {
              const newStops = [...config.advanced.body.colorRamp.stops];
              newStops[0] = { ...newStops[0], color: e.target.value };
              updateAdvanced('body', { colorRamp: { ...config.advanced.body.colorRamp, stops: newStops } });
            }}
            style={{ width: '100%', height: '32px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            End Color
          </label>
          <input
            type="color"
            value={config.advanced.body.colorRamp.stops[1].color}
            onChange={(e) => {
              const newStops = [...config.advanced.body.colorRamp.stops];
              newStops[1] = { ...newStops[1], color: e.target.value };
              updateAdvanced('body', { colorRamp: { ...config.advanced.body.colorRamp, stops: newStops } });
            }}
            style={{ width: '100%', height: '32px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
          <input
            type="checkbox"
            checked={config.advanced.body.unionMode}
            onChange={(e) => updateAdvanced('body', { unionMode: e.target.checked })}
          />
          Union body layers (flatten)
        </label>
      </Section>

      {/* Highlight Settings */}
      <Section title="Highlight (Top Layer)" id="highlight">
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            Stroke Color
          </label>
          <input
            type="color"
            value={config.advanced.highlightTop.strokeColor}
            onChange={(e) => updateAdvanced('highlightTop', { strokeColor: e.target.value })}
            style={{ width: '100%', height: '32px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            Stroke Width: {config.advanced.highlightTop.strokeWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={config.advanced.highlightTop.strokeWidth}
            onChange={(e) => updateAdvanced('highlightTop', { strokeWidth: parseInt(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </Section>

      {/* Shadow Settings */}
      <Section title="Shadow Settings" id="shadow">
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            Shadow Layers: {config.advanced.shadowBottom.layers}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={config.advanced.shadowBottom.layers}
            onChange={(e) => updateAdvanced('shadowBottom', { layers: parseInt(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            Max Blur: {config.advanced.shadowBottom.maxBlur}px
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={config.advanced.shadowBottom.maxBlur}
            onChange={(e) => updateAdvanced('shadowBottom', { maxBlur: parseInt(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
      </Section>

      {/* Glow Settings */}
      <Section title="Glow Effect" id="glow">
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <input
              type="checkbox"
              checked={config.advanced.glow.enabled}
              onChange={(e) => updateAdvanced('glow', { enabled: e.target.checked })}
            />
            Enable Glow
          </label>
        </div>

        {config.advanced.glow.enabled && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
                Intensity: {Math.round(config.advanced.glow.intensity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.advanced.glow.intensity}
                onChange={(e) => updateAdvanced('glow', { intensity: parseFloat(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
                Blur: {config.advanced.glow.blur}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={config.advanced.glow.blur}
                onChange={(e) => updateAdvanced('glow', { blur: parseInt(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          </>
        )}
      </Section>
    </div>
  );
};

export default AdvancedMode;