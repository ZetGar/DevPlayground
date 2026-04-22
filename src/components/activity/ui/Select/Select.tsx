"use client";

import styles from "./Select.module.css";
import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

export default function Select({ value, onChange, options }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      {/* 선택 영역 */}
      <div
        className={styles.selectBox}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selected?.label}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.up : ""}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12.0008 14.58L17 10" stroke="#0A090B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {/* 옵션 */}
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.option} ${
                opt.value === value ? styles.selected : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}