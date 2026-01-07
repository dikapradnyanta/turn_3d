// App.tsx - Main React UI Component

import React, { useState, useEffect } from 'react';
import { Text3DConfig, Preset, UIMessage, PluginMessage, DEFAULT_CONFIG } from './types';
import SimpleMode from './components/SimpleMode';
import AdvancedMode from './components/AdvancedMode';
import PresetManager from './components/PresetManager';

function App() {
  const [config, setConfig] = useState<Text3DConfig>(DEFAULT_CONFIG);
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [isExisting, setIsExisting] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Listen for messages from plugin
    window.onmessage = (event) => {
      const msg: UIMessage = event.data.pluginMessage;
      
      switch (msg.type) {
        case 'config-loaded':
          if (msg.config) {
            setConfig(msg.config);
            setMode(msg.config.mode);
            setIsExisting(msg.isExisting || false);
          }
          break;
          
        case 'presets-loaded':
          if (msg.presets) {
            setPresets(msg.presets);
          }
          break;
          
        case 'generation-complete':
          setIsGenerating(false);
          break;
          
        case 'error':
          setIsGenerating(false);
          alert(`Error: ${msg.error}`);
          break;
      }
    };
    
    // Request presets on mount
    postMessage({ type: 'get-presets' });
  }, []);

  const postMessage = (msg: PluginMessage) => {
    parent.postMessage({ pluginMessage: msg }, '*');
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const updatedConfig = { ...config, mode };
    postMessage({
      type: isExisting ? 'update' : 'generate',
      config: updatedConfig
    });
  };

  const handleSavePreset = (name: string) => {
    const preset: Preset = {
      id: Date.now().toString(),
      name,
      config: { ...config, mode }
    };
    postMessage({ type: 'save-preset', preset });
  };

  const handleLoadPreset = (presetId: string) => {
    postMessage({ type: 'load-preset', presetId });
  };

  const handleDeletePreset = (presetId: string) => {
    postMessage({ type: 'delete-preset', presetId });
  };

  return (
    <div style={{ 
      padding: '16px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '12px'
    }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
        3D Text Generator
      </h2>

      {/* Mode Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '16px',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '8px'
      }}>
        <button
          onClick={() => setMode('simple')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: mode === 'simple' ? '#0066FF' : 'transparent',
            color: mode === 'simple' ? 'white' : '#666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: mode === 'simple' ? '600' : '400',
            fontSize: '12px'
          }}
        >
          Simple
        </button>
        <button
          onClick={() => setMode('advanced')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: mode === 'advanced' ? '#0066FF' : 'transparent',
            color: mode === 'advanced' ? 'white' : '#666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: mode === 'advanced' ? '600' : '400',
            fontSize: '12px'
          }}
        >
          Advanced
        </button>
      </div>

      {/* Text Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
          Text
        </label>
        <input
          type="text"
          value={config.text.content}
          onChange={(e) => setConfig({
            ...config,
            text: { ...config.text, content: e.target.value }
          })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
          placeholder="Enter text..."
        />
      </div>

      {/* Font Size */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
          Font Size: {config.text.fontSize}px
        </label>
        <input
          type="range"
          min="20"
          max="200"
          value={config.text.fontSize}
          onChange={(e) => setConfig({
            ...config,
            text: { ...config.text, fontSize: parseInt(e.target.value) }
          })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Mode-specific controls */}
      {mode === 'simple' ? (
        <SimpleMode config={config} onChange={setConfig} />
      ) : (
        <AdvancedMode config={config} onChange={setConfig} />
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !config.text.content}
        style={{
          width: '100%',
          padding: '12px',
          background: isGenerating || !config.text.content ? '#ccc' : '#0066FF',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isGenerating || !config.text.content ? 'not-allowed' : 'pointer',
          marginBottom: '16px'
        }}
      >
        {isGenerating ? 'Generating...' : (isExisting ? 'Update Text' : 'Generate Text')}
      </button>

      {/* Preset Manager */}
      <PresetManager
        presets={presets}
        onSave={handleSavePreset}
        onLoad={handleLoadPreset}
        onDelete={handleDeletePreset}
      />
    </div>
  );
}

export default App;