"use client";

import { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'leads' | 'deals' | 'contacts';
}

export default function ImportModal({ isOpen, onClose, onSuccess, type }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<{ count: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`http://localhost:3001/crm/import/${type}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setResult(data);
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.message || 'Import failed. Please check your file format.');
            }
        } catch (err) {
            console.error('Import error:', err);
            setError('An error occurred during upload.');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1, -1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl shadow-blue-500/10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Import {typeLabel}s</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">Upload Excel or CSV file.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-100">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {!result ? (
                        <>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${file ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".csv, .xlsx, .xls"
                                />
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${file ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <Upload size={28} />
                                </div>
                                <p className="text-sm font-black text-slate-900">{file ? file.name : 'Choose a file to upload'}</p>
                                <p className="text-xs text-slate-400 font-medium mt-1">Excel or CSV files up to 10MB</p>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold leading-relaxed">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <FileText size={12} className="text-blue-400" />
                                        Formatting Tips
                                    </h4>
                                    <ul className="space-y-2">
                                        <li className="text-[11px] text-slate-600 font-medium flex gap-2">
                                            <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5" />
                                            Include headers like "Title", "Email", "Phone"
                                        </li>
                                        <li className="text-[11px] text-slate-600 font-medium flex gap-2">
                                            <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5" />
                                            Ensure data is on the first sheet
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={!file || uploading}
                                    className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : 'Start Import'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Import Complete!</h3>
                            <p className="text-slate-500 font-medium mt-2 max-w-[240px]">
                                Successfully imported <span className="text-green-600 font-black">{result.count}</span> records into your {typeLabel}s database.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-8 bg-slate-900 hover:bg-black text-white rounded-2xl py-4 px-12 font-black shadow-xl transition-all active:scale-[0.98]"
                            >
                                Nice! Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
