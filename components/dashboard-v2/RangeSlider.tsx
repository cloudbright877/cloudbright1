import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  label: string;
  unit?: string;
  disabled?: boolean;
}

export default function RangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  label,
  unit = '',
  disabled = false,
}: RangeSliderProps) {
  const [localValues, setLocalValues] = useState([valueMin, valueMax]);

  useEffect(() => {
    setLocalValues([valueMin, valueMax]);
  }, [valueMin, valueMax]);

  const handleSliderChange = (values: number[]) => {
    setLocalValues(values);
    onChange(values[0], values[1]);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= min && value <= localValues[1]) {
      const newValues = [value, localValues[1]];
      setLocalValues(newValues);
      onChange(newValues[0], newValues[1]);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value <= max && value >= localValues[0]) {
      const newValues = [localValues[0], value];
      setLocalValues(newValues);
      onChange(newValues[0], newValues[1]);
    }
  };

  return (
    <div className={`space-y-3 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Label and Input Fields */}
      <div className="flex items-center justify-between gap-3">
        {label && <label className="text-sm font-medium text-dark-300">{label}</label>}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={localValues[0]}
            onChange={handleMinInputChange}
            min={min}
            max={localValues[1]}
            step={step}
            disabled={disabled}
            className="w-20 px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none text-center"
          />
          <span className="text-dark-500">-</span>
          <input
            type="number"
            value={localValues[1]}
            onChange={handleMaxInputChange}
            min={localValues[0]}
            max={max}
            step={step}
            disabled={disabled}
            className="w-20 px-2 py-1 text-sm bg-dark-800 border border-dark-600 rounded text-white focus:border-primary-500 outline-none text-center"
          />
          {unit && <span className="text-xs text-dark-400">{unit}</span>}
        </div>
      </div>

      {/* Radix Slider */}
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={localValues}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className="bg-dark-700 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-gradient-to-r from-primary-500 to-primary-400 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-3 border-primary-500 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 cursor-grab active:cursor-grabbing"
          aria-label="Minimum value"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-3 border-primary-500 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 cursor-grab active:cursor-grabbing"
          aria-label="Maximum value"
        />
      </Slider.Root>
    </div>
  );
}
