"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [25, 50, 100];

export default function Pagination({ total, page, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    // Build visible page range with ellipsis
    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('...');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
            if (page < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="font-medium">Show</span>
                <select
                    value={pageSize}
                    onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                    {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="font-medium">per page</span>
                {total > 0 && (
                    <span className="ml-2 text-slate-400">
                        {start}–{end} of <span className="font-bold text-slate-600">{total}</span>
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-slate-300 font-bold">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`min-w-[36px] h-9 px-3 rounded-xl text-sm font-black transition-all ${p === page
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                    : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
