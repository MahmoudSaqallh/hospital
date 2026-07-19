"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type DropdownProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export default function Dropdown({
  value,
  options,
  onChange,
  placeholder = "اختر...",
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  function pick(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={`relative ${open ? "z-[90]" : "z-10"} ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        className={`group flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition ${
          open
            ? "border-[#0e6c09] ring-2 ring-[#0e6c09]/20 shadow-sm"
            : "border-line hover:border-[#0e6c09]/40"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <span
          className={`min-w-0 truncate text-right font-medium ${
            selected ? "text-ink" : "text-muted"
          }`}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#0e6c09]/70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-[100] max-h-60 overflow-auto rounded-xl border border-line bg-white p-1.5 shadow-[0_18px_40px_-18px_rgba(15,34,51,0.35)]"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-muted">لا توجد خيارات</li>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li key={opt.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => {
                        if (!opt.disabled) pick(opt.value);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-right text-sm transition ${
                        isSelected
                          ? "bg-[#0e6c09]/10 font-semibold text-[#0e6c09]"
                          : "text-ink hover:bg-[#0e6c09]/5 hover:text-[#0e6c09]"
                      } ${opt.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <span className="min-w-0 truncate">{opt.label}</span>
                      {isSelected ? <Check size={16} className="shrink-0" /> : null}
                    </button>
                  </li>
                );
              })
            )}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
