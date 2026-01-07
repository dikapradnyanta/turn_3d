// usePluginState.ts - Custom hook for plugin state management

import { useState, useEffect, useCallback } from 'react';
import { Text3DConfig, Preset, UIMessage, PluginMessage, DEFAULT_CONFIG } from '../types';

interface PluginState {
  config: Text3DConfig;
  mode: 'simple' | 'advanced';
  isExisting: boolean;
  presets: Preset[];
  isGenerating: boolean;
  error: string | null;
}

interface PluginActions {
  setConfig: (config: Text3DConfig) => void;
  setMode: (mode: 'simple' | 'advanced') => void;
  updateConfig: (updates: Partial<Text3DConfig>) => void;
  updateSimple: (updates: Partial<Text3DConfig['simple']>) => void;
  updateAdvanced: (section: keyof Text3DConfig['advanced'], updates: any) => void;
  updateText: (updates: Partial<Text3DConfig['text']>) => void;
  generate: () => void;
  savePreset: (name: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  refreshPresets: () => void;
}

export function usePluginState(): [PluginState, PluginActions] {
  const [state, setState] = useState<PluginState>({
    config: DEFAULT_CONFIG,
    mode: 'simple',
    isExisting: false,
    presets: [],
    isGenerating: false,
    error: null,
  });

  // Post message to plugin
  const postMessage = useCallback((msg: PluginMessage) => {
    parent.postMessage({ pluginMessage: msg }, '*');
  }, []);

  // Listen for messages from plugin
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg: UIMessage = event.data.pluginMessage;
      
      switch (msg.type) {
        case 'config-loaded':
          if (msg.config) {
            setState(prev => ({
              ...prev,
              config: msg.config!,
              mode: msg.config!.mode,
              isExisting: msg.isExisting || false,
              error: null,
            }));
          }
          break;
          
        case 'presets-loaded':
          if (msg.presets) {
            setState(prev => ({
              ...prev,
              presets: msg.presets!,
            }));
          }
          break;
          
        case 'generation-complete':
          setState(prev => ({
            ...prev,
            isGenerating: false,
            error: null,
          }));
          break;
          
        case 'error':
          setState(prev => ({
            ...prev,
            isGenerating: false,
            error: msg.error || 'Unknown error occurred',
          }));
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Request presets on mount
    postMessage({ type: 'get-presets' });
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [postMessage]);

  // Actions
  const actions: PluginActions = {
    setConfig: useCallback((config: Text3DConfig) => {
      setState(prev => ({ ...prev, config }));
    }, []),

    setMode: useCallback((mode: 'simple' | 'advanced') => {
      setState(prev => ({ ...prev, mode }));
    }, []),

    updateConfig: useCallback((updates: Partial<Text3DConfig>) => {
      setState(prev => ({
        ...prev,
        config: { ...prev.config, ...updates },
      }));
    }, []),

    updateSimple: useCallback((updates: Partial<Text3DConfig['simple']>) => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          simple: { ...prev.config.simple, ...updates },
        },
      }));
    }, []),

    updateAdvanced: useCallback((section: keyof Text3DConfig['advanced'], updates: any) => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          advanced: {
            ...prev.config.advanced,
            [section]: { ...prev.config.advanced[section], ...updates },
          },
        },
      }));
    }, []),

    updateText: useCallback((updates: Partial<Text3DConfig['text']>) => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          text: { ...prev.config.text, ...updates },
        },
      }));
    }, []),

    generate: useCallback(() => {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));
      
      const updatedConfig = { ...state.config, mode: state.mode };
      postMessage({
        type: state.isExisting ? 'update' : 'generate',
        config: updatedConfig,
      });
    }, [state.config, state.mode, state.isExisting, postMessage]),

    savePreset: useCallback((name: string) => {
      const preset: Preset = {
        id: Date.now().toString(),
        name,
        config: { ...state.config, mode: state.mode },
      };
      postMessage({ type: 'save-preset', preset });
    }, [state.config, state.mode, postMessage]),

    loadPreset: useCallback((presetId: string) => {
      postMessage({ type: 'load-preset', presetId });
    }, [postMessage]),

    deletePreset: useCallback((presetId: string) => {
      postMessage({ type: 'delete-preset', presetId });
    }, [postMessage]),

    refreshPresets: useCallback(() => {
      postMessage({ type: 'get-presets' });
    }, [postMessage]),
  };

  return [state, actions];
}

// Helper hooks for specific sections
export function useSimpleMode(actions: PluginActions) {
  return {
    updateHue: (hue: number) => actions.updateSimple({ baseHue: hue }),
    updateDepth: (depth: number) => actions.updateSimple({ depth }),
  };
}

export function useAdvancedMode(actions: PluginActions) {
  return {
    updateBody: (updates: any) => actions.updateAdvanced('body', updates),
    updateHighlight: (updates: any) => actions.updateAdvanced('highlightTop', updates),
    updateShadow: (updates: any) => actions.updateAdvanced('shadowBottom', updates),
    updateGlow: (updates: any) => actions.updateAdvanced('glow', updates),
  };
}