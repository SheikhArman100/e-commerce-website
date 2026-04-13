import { useEffect, useRef, useState } from 'react';

const PriceSlider = ({ min = 0, max = 1000, value = { min: null, max: null }, onChange }) => {
  const [minVal, setMinVal] = useState(value.min || min);
  const [maxVal, setMaxVal] = useState(value.max || max);
  const minValRef = useRef(value.min || min);
  const maxValRef = useRef(value.max || max);
  const rangeRef = useRef(null);

  // Convert to percentage
  const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current !== null) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxValRef.current);

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current !== null) {
      const minPercent = getPercent(minValRef.current);
      const maxPercent = getPercent(maxVal);

      if (rangeRef.current) {
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Sync with prop changes (e.g. from Clear Filters)
  useEffect(() => {
    setMinVal(value.min || min);
    setMaxVal(value.max || max);
  }, [value.min, value.max, min, max]);

  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxVal - 1);
    setMinVal(value);
    minValRef.current = value;
    onChange({ min: value, max: maxVal });
  };

  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minVal + 1);
    setMaxVal(value);
    maxValRef.current = value;
    onChange({ min: minVal, max: value });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative h-1 w-full bg-accentColor/10 rounded-full">
        <div
          ref={rangeRef}
          className="absolute h-1 bg-accentColor rounded-full"
        />
        
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="thumb thumb--zindex-3 pointer-events-none absolute h-0 w-full outline-none"
          style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="thumb thumb--zindex-4 pointer-events-none absolute h-0 w-full outline-none"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[0.65rem] text-stone-500 uppercase tracking-widest">Min Price</span>
          <span className="text-textColor font-medium">৳{minVal}</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[0.65rem] text-stone-500 uppercase tracking-widest">Max Price</span>
          <span className="text-textColor font-medium">৳{maxVal}</span>
        </div>
      </div>

      <style jsx>{`
        .thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }

        .thumb::-webkit-slider-thumb {
          background-color: #9B2242;
          border: 2px solid #FFFBF2;
          border-radius: 50%;
          cursor: pointer;
          height: 18px;
          width: 18px;
          margin-top: 0px;
          pointer-events: all;
          position: relative;
          -webkit-appearance: none;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .thumb::-moz-range-thumb {
          background-color: #9B2242;
          border: 2px solid #FFFBF2;
          border-radius: 50%;
          cursor: pointer;
          height: 18px;
          width: 18px;
          pointer-events: all;
          position: relative;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </div>
  );
};

export default PriceSlider;
