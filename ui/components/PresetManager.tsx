// PresetManager.tsx - Preset management component

import React, { useState } from 'react';
import { Preset } from '../types';

interface PresetManagerProps {
  presets: Preset[];
  onSave: (name: string) => void;
  onLoad: (presetId: string) => void;
  onDelete: (presetId: string) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({ presets, onSave, onLoad, onDelete }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (presetName.trim()) {
      onSave(presetName.trim());
      setPresetName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div style={{ 
      borderTop: '1px solid #e0e0e0', 
      paddingTop: '16px',
      marginTop: '16px'
    }}>
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '14px', 
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Presets
        <button
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          style={{
            padding: '4px 12px',
            background: '#0066FF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + Save Current
        </button>
      </h3>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div style={{
          padding: '12px',
          background: '#f8f8f8',
          borderRadius: '4px',
          marginBottom: '12px'
        }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '500' }}>
            Preset Name
          </label>
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="My Awesome Preset"
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '12px',
              marginBottom: '8px',
              boxSizing: 'border-box'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSave}
              disabled={!presetName.trim()}
              style={{
                flex: 1,
                padding: '6px',
                background: presetName.trim() ? '#0066FF' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: presetName.trim() ? 'pointer' : 'not-allowed',
                fontWeight: '500'
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setPresetName('');
              }}
              style={{
                flex: 1,
                padding: '6px',
                background: 'transparent',
                color: '#666',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Preset List */}
      {presets.length === 0 ? (
        <div style={{
          padding: '16px',
          textAlign: 'center',
          color: '#999',
          fontSize: '11px',
          background: '#f8f8f8',
          borderRadius: '4px'
        }}>
          No presets saved yet. Create your first preset!
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {presets.map(preset => (
            <div
              key={preset.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: '#f8f8f8',
                borderRadius: '4px',
                fontSize: '12px',
                border: '1px solid #e0e0e0'
              }}
            >
              <span 
                style={{ 
                  flex: 1, 
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onClick={() => onLoad(preset.id)}
              >
                {preset.name}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => onLoad(preset.id)}
                  style={{
                    padding: '4px 8px',
                    background: '#0066FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Load
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete preset "${preset.name}"?`)) {
                      onDelete(preset.id);
                    }
                  }}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    color: '#ff4444',
                    border: '1px solid #ff4444',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PresetManager;