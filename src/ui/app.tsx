// ui/app.tsx - Main React UI Component (FIXED)

import React from 'react';
import { usePluginState } from './hooks/usePluginState';
import SimpleMode from './components/SimpleMode';
import AdvancedMode from './components/AdvancedMode';
import PresetManager from './components/PresetManager';

function App() {
  const [state, actions] = usePluginState();
  const { config, mode, isExisting, presets, isGenerating } = state;

  return (
    <div style={{
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '12px',
      background: '#fff',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
          3D Extruder
        </h2>
        {isExisting && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            background: '#F0F0F0',
            border: '1px solid #E5E5E5',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#333',
            fontWeight: '500',
            marginTop: '4px'
          }}>
            Editing Generated Extrusion
          </div>
        )}
        {config.isGraphic && !isExisting && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            background: '#E5F3FF',
            border: '1px solid #BFE2FF',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#0066FF',
            fontWeight: '500',
            marginTop: '4px'
          }}>
            Graphic Layer Selected
          </div>
        )}
      </div>

        <button
          onClick={() => actions.setMode('simple')}
          style={{
            flex: 1,
            padding: '6px 12px',
            border: 'none',
            background: mode === 'simple' ? '#FFFFFF' : 'transparent',
            color: mode === 'simple' ? '#333' : '#888',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: mode === 'simple' ? '600' : '400',
            fontSize: '11px',
            boxShadow: mode === 'simple' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          Simple
        </button>
        <button
          onClick={() => actions.setMode('advanced')}
          style={{
            flex: 1,
            padding: '6px 12px',
            border: 'none',
            background: mode === 'advanced' ? '#FFFFFF' : 'transparent',
            color: mode === 'advanced' ? '#333' : '#888',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: mode === 'advanced' ? '600' : '400',
            fontSize: '11px',
            boxShadow: mode === 'advanced' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          Advanced
        </button>

      {!config.isGraphic && (
        <React.Fragment>
          {/* Text Input */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '11px', color: '#666' }}>
              Text Content
            </label>
            <input
              type="text"
              value={config.text.content}
              onChange={(e) => actions.updateText({ content: e.target.value })}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontSize: '12px',
                outline: 'none',
                color: '#333',
              }}
              placeholder="Enter text..."
            />
          </div>

          {/* Font Size */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '11px', color: '#666' }}>
              Font Size: {config.text.fontSize}px
            </label>
            <input
              type="range"
              min="20"
              max="200"
              value={config.text.fontSize}
              onChange={(e) => actions.updateText({ fontSize: parseInt(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Font Weight */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '11px', color: '#666' }}>
              Font Weight
            </label>
            <select
              value={config.text.fontWeight}
              onChange={(e) => actions.updateText({ fontWeight: e.target.value })}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #E5E5E5',
                borderRadius: '4px',
                fontSize: '12px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="Regular">Regular</option>
              <option value="Medium">Medium</option>
              <option value="SemiBold">SemiBold</option>
              <option value="Bold">Bold</option>
              <option value="ExtraBold">ExtraBold</option>
              <option value="Black">Black</option>
            </select>
          </div>
        </React.Fragment>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid #F0F0F0', marginBottom: '16px' }} />

      {/* Mode-specific controls */}
      {mode === 'simple' ? (
        <SimpleMode config={config} actions={actions} />
      ) : (
        <AdvancedMode config={config} actions={actions} />
      )}

      {/* Generate / Update Button */}
      <button
        onClick={actions.generate}
        disabled={isGenerating || (!config.isGraphic && !config.text.content.trim())}
        style={{
          width: '100%',
          padding: '10px',
          background: isGenerating || (!config.isGraphic && !config.text.content.trim())
            ? '#E5E5E5'
            : '#0D99FF',
          color: isGenerating || (!config.isGraphic && !config.text.content.trim()) ? '#888' : 'white',
          border: '1px solid ' + (isGenerating || (!config.isGraphic && !config.text.content.trim()) ? '#E5E5E5' : '#0D99FF'),
          borderRadius: '5px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: isGenerating || (!config.isGraphic && !config.text.content.trim()) ? 'not-allowed' : 'pointer',
          marginBottom: '16px',
          transition: 'background 0.2s ease',
        }}
      >
        {isGenerating
          ? 'Generating...'
          : isExisting
            ? 'Update 3D Effect'
            : 'Apply 3D Effect'}
      </button>

      {/* Preset Manager */}
      <PresetManager
        presets={presets}
        onSave={actions.savePreset}
        onLoad={actions.loadPreset}
        onDelete={actions.deletePreset}
      />
    </div>
  );
}

export default App;