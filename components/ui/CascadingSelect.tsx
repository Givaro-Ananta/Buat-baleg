'use client';

import { useEffect, useRef, useState } from 'react';
import { Department, Division } from '@/types';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CascadingSelectProps {
  departments: Department[];
  selectedDeptCode: string;
  selectedDivCode: string;
  onDeptChange: (kodeDepartemen: string, namaDepartemen: string) => void;
  onDivChange: (kodeDivisi: string, namaDivisi: string) => void;
  disabled?: boolean;
  error?: { dept?: string; div?: string };
}

export default function CascadingSelect({
  departments,
  selectedDeptCode,
  selectedDivCode,
  onDeptChange,
  onDivChange,
  disabled,
  error,
}: CascadingSelectProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);

  // Update divisions when department changes
  useEffect(() => {
    const dept = departments.find((d) => d.kodeDepartemen === selectedDeptCode);
    const divs = dept?.divisi ?? [];
    setDivisions(divs);

    // Auto-select if only one division
    if (divs.length === 1) {
      onDivChange(divs[0].kodeDivisi, divs[0].namaDivisi);
    } else if (divs.length === 0 || !divs.find((d) => d.kodeDivisi === selectedDivCode)) {
      onDivChange('', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeptCode, departments]);

  const selectClass = (hasError?: boolean) =>
    cn(
      'w-full appearance-none bg-white border-2 rounded-xl px-4 py-3 pr-10',
      'text-navy-900 font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
      hasError ? 'border-red-400' : 'border-gray-200 hover:border-gold-500',
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Departemen Dropdown */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-navy-900">
          Departemen <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="select-departemen"
            title="Pilih Departemen"
            aria-label="Pilih Departemen"
            className={selectClass(!!error?.dept)}
            value={selectedDeptCode}
            disabled={disabled}
            onChange={(e) => {
              const dept = departments.find((d) => d.kodeDepartemen === e.target.value);
              onDeptChange(e.target.value, dept?.namaDepartemen ?? '');
            }}
          >
            <option value="">— Pilih Departemen —</option>
            {departments.map((dept) => (
              <option key={dept.kodeDepartemen} value={dept.kodeDepartemen}>
                {dept.namaDepartemen}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
        </div>
        {error?.dept && <p className="text-xs text-red-500">{error.dept}</p>}
      </div>

      {/* Divisi Dropdown */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-navy-900">
          Divisi <span className="text-red-500">*</span>
          {divisions.length === 1 && (
            <span className="ml-2 text-xs font-normal text-gold-500">(otomatis dipilih)</span>
          )}
        </label>
        <div className="relative">
          <select
            id="select-divisi"
            title="Pilih Divisi"
            aria-label="Pilih Divisi"
            className={selectClass(!!error?.div)}
            value={selectedDivCode}
            disabled={disabled || !selectedDeptCode || divisions.length <= 1}
            onChange={(e) => {
              const div = divisions.find((d) => d.kodeDivisi === e.target.value);
              onDivChange(e.target.value, div?.namaDivisi ?? '');
            }}
          >
            {divisions.length === 0 ? (
              <option value="">— Pilih Departemen dulu —</option>
            ) : divisions.length === 1 ? (
              <option value={divisions[0].kodeDivisi}>{divisions[0].namaDivisi}</option>
            ) : (
              <>
                <option value="">— Pilih Divisi —</option>
                {divisions.map((div) => (
                  <option key={div.kodeDivisi} value={div.kodeDivisi}>
                    {div.namaDivisi}
                  </option>
                ))}
              </>
            )}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
        </div>
        {error?.div && <p className="text-xs text-red-500">{error.div}</p>}
      </div>
    </div>
  );
}
