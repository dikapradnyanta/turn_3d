// Slider.tsx - Reusable slider component

import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  showMinMax?: boolean;
  minLabel?: string;
  maxLabel?: string;
  style?: React.CSSProperties;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  showMinMax = false,
  minLabel,
  maxLabel,
  style
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = step % 1 === 0 
      ? parseInt(e.target.value) 
      : parseFloat(e.target.value);
    onChange(newValue);
  };

  const displayValue = step % 1 === 0 
    ? Math.round(value) 
    : value.toFixed(step === 0.1 ? 1 : 2);

  return (
    <div style={{ marginBottom: '12px', ...style }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '4px', 
        fontSize: '11px', 
        fontWeight: '500',
        color: '#333'
      }}>
        {label}: <span style={{ color: '#0066FF', fontWeight: '600' }}>{displayValue}{unit}</span>
      </label>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{ 
          width: '100%',
          cursor: 'pointer'
        }}
      />
      
      {showMinMax && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '10px', 
          color: '#999',
          marginTop: '4px'
        }}>
          <span>{minLabel || `${min}${unit}`}</span>
          <span>{maxLabel || `${max}${unit}`}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;