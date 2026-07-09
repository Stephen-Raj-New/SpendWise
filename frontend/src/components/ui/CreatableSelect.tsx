import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface CreatableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onCreateOption: (inputValue: string) => void;
  placeholder?: string;
  error?: string;
  name?: string;
  onBlur?: (e: any) => void;
}

export const CreatableSelect: React.FC<CreatableSelectProps> = ({
  options,
  value,
  onChange,
  onCreateOption,
  placeholder = 'Select or type to add...',
  error,
  name,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync selected value with input display when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      const selectedOption = options.find((opt) => opt.value === value);
      setInputValue(selectedOption ? selectedOption.label : value);
    }
  }, [value, options, isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (onBlur) {
          onBlur({ target: { name } });
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onBlur, name]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const isExactMatch = options.some((opt) => opt.label.toLowerCase() === inputValue.trim().toLowerCase());
  const showCreateOption = inputValue.trim().length > 0 && !isExactMatch;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`flex items-center w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:bg-slate-700 dark:text-white transition-colors focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
        }`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <ChevronDown size={16} className="text-slate-400 ml-2 cursor-pointer shrink-0" />
      </div>
      
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                    value === opt.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-300'
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setInputValue(opt.label);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          ) : (
            !showCreateOption && <div className="px-4 py-3 text-sm text-slate-500 text-center">No options found</div>
          )}

          {showCreateOption && (
            <div className="border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                onClick={() => {
                  onCreateOption(inputValue.trim());
                  setIsOpen(false);
                }}
              >
                <Plus size={14} />
                <span className="font-medium">Add "{inputValue.trim()}" as new category</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
