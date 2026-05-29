import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

interface SelectOption {
  label: string
  value: string | number
}

interface CustomSelectProps {
  value: string | number
  onChange: (val: any) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

const CustomSelect = ({ value, onChange, options, placeholder, className }: CustomSelectProps) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div ref={wrapperRef} className={`relative ${className || ''}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border bg-[#1A1A1A] px-4 py-2.5 text-sm text-white transition-all duration-200 ${
          open ? 'border-[#DC1428] ring-2 ring-[#DC1428]/20' : 'border-white/[0.08]'
        }`}
      >
        <span>{selectedOption?.label || placeholder || 'Select an option'}</span>
        <ChevronDown
          size={16}
          className={`text-[#888888] transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-52 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#1A1A1A] p-1 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={`${option.value}`}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                  isSelected
                    ? 'bg-[#222222] font-medium text-white'
                    : 'text-white hover:bg-[#222222]'
                }`}
              >
                <span>{option.label}</span>
                {isSelected ? <Check size={14} className="text-[#DC1428]" /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default CustomSelect
