import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import Label from './Label';

export interface ComboboxOption {
  value: string;
  label: string;
  subtitle?: string;
  imageUrl?: string | null;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  required?: boolean;
  error?: string;
  onCreateNew?: () => void;
  createNewText?: string;
}

export default function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  required,
  error,
  onCreateNew,
  createNewText = 'Create new',
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (opt.subtitle && opt.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && <Label required={required}>{label}</Label>}
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 bg-black/5 dark:bg-white/5 border rounded-md text-sm text-left transition-colors focus:outline-none focus:ring-1 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-border-primary focus:ring-accent-primary hover:border-accent-primary/50'
        }`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-secondary-text' : 'text-primary-text'}`}>
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.imageUrl && (
                <img src={selectedOption.imageUrl} alt="" className="w-5 h-5 object-contain" />
              )}
              {selectedOption.label}
            </div>
          ) : (
            placeholder
          )}
        </span>
        <ChevronsUpDown className="w-4 h-4 text-secondary-text shrink-0 ml-2" />
      </button>
      
      {error && <span className="text-xs text-red-500 mt-1.5 block">{error}</span>}

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-surface-light border border-border-primary rounded-md shadow-lg overflow-hidden">
          <div className="flex items-center px-3 border-b border-border-primary">
            <Search className="w-4 h-4 text-secondary-text shrink-0 mr-2" />
            <input
              type="text"
              className="w-full bg-transparent py-2.5 text-sm focus:outline-none text-primary-text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 px-3 text-center text-sm text-secondary-text">
                <p className="mb-2">{emptyText}</p>
                {onCreateNew && (
                  <button
                    type="button"
                    className="text-accent-primary font-medium hover:underline flex items-center justify-center w-full"
                    onClick={() => {
                      setOpen(false);
                      onCreateNew();
                    }}
                  >
                    + {createNewText}
                  </button>
                )}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                    value === option.value ? 'bg-black/5 dark:bg-white/5 font-medium text-primary-text' : 'text-secondary-text hover:text-primary-text'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="flex items-center gap-3 truncate">
                    {option.imageUrl && (
                      <div className="w-6 h-6 rounded bg-white p-0.5 shrink-0 flex items-center justify-center border border-border-primary">
                        <img src={option.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="truncate">{option.label}</span>
                      {option.subtitle && (
                        <span className="text-xs text-secondary-text truncate">{option.subtitle}</span>
                      )}
                    </div>
                  </div>
                  {value === option.value && <Check className="w-4 h-4 text-accent-primary shrink-0 ml-2" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
