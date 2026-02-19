"use client";

import { useState, useEffect } from 'react';
import { Columns, Check, X, Settings2, RotateCcw } from 'lucide-react';

interface ColumnCustomizerProps {
    module: string;
    availableColumns: { key: string; label: string }[];
    currentColumns: string[];
    onSave: (columns: string[]) => void;
}

export default function ColumnCustomizer({ module, availableColumns, currentColumns, onSave }: ColumnCustomizerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>(currentColumns);

    useEffect(() => {
        setSelected(currentColumns);
    }, [currentColumns]);

    const toggleColumn = (key: string) => {
        if (selected.includes(key)) {
            if (selected.length > 1) {
                setSelected(selected.filter(k => k !== key));
            }
        } else {
            setSelected([...selected, key]);
        }
    };

    const handleSave = () => {
        onSave(selected);
        setIsOpen(false);
    };

    const handleReset = () => {
        setSelected(availableColumns.map(c => c.key));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
                <Columns size={16} />
                Columns
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-slate-50 p-6 z-[70] animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Customize View</h3>
                            <button onClick={handleReset} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all" title="Reset to default">
                                <RotateCcw size={14} />
                            </button>
                        </div>

                        <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                            {availableColumns.map((col) => {
                                const isSelected = selected.includes(col.key);
                                return (
                                    <button
                                        key={col.key}
                                        onClick={() => toggleColumn(col.key)}
                                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-sm font-bold transition-all ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {col.label}
                                        {isSelected && <Check size={14} />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 flex gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-slate-900/10"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
