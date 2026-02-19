"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, User, Briefcase, Building2, UserCheck, Shield, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 2) {
                handleSearch();
            } else {
                setResults(null);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/crm/search?q=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setResults(await res.json());
                setIsOpen(true);
            }
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const navigateTo = (path: string) => {
        router.push(path);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative w-full max-w-xl" ref={searchRef}>
            <div className={`relative flex items-center transition-all duration-300 ${isOpen ? 'scale-105' : ''}`}>
                <Search className={`absolute left-4 transition-colors ${loading ? 'text-blue-500' : 'text-slate-400'}`} size={18} />
                <input
                    type="text"
                    placeholder="Search leads, deals, contacts..."
                    className="w-full bg-slate-100/50 border-none rounded-2xl py-3 pl-12 pr-12 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setIsOpen(true)}
                />
                {loading && <Loader2 className="absolute right-4 animate-spin text-blue-500" size={18} />}
                {query && !loading && <button onClick={() => setQuery('')} className="absolute right-4 text-slate-400 hover:text-slate-600"><X size={18} /></button>}
            </div>

            {isOpen && results && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[32px] shadow-2xl border border-slate-50 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-300">
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
                        {/* Leads */}
                        {results.leads?.length > 0 && (
                            <ResultSection
                                title="Leads"
                                icon={<User size={14} />}
                                items={results.leads}
                                render={(l: any) => (
                                    <ResultItem
                                        key={l._id}
                                        title={`${l.firstName} ${l.lastName}`}
                                        sub={l.email}
                                        onClick={() => navigateTo(`/leads`)}
                                    />
                                )}
                            />
                        )}

                        {/* Deals */}
                        {results.deals?.length > 0 && (
                            <ResultSection
                                title="Deals"
                                icon={<Briefcase size={14} />}
                                items={results.deals}
                                render={(d: any) => (
                                    <ResultItem
                                        key={d._id}
                                        title={d.organization}
                                        sub={`$${d.dealValue?.toLocaleString()} • ${d.status}`}
                                        onClick={() => navigateTo(`/deals`)}
                                    />
                                )}
                            />
                        )}

                        {/* Organizations */}
                        {results.organizations?.length > 0 && (
                            <ResultSection
                                title="Organizations"
                                icon={<Building2 size={14} />}
                                items={results.organizations}
                                render={(o: any) => (
                                    <ResultItem
                                        key={o._id}
                                        title={o.name}
                                        sub={o.industry || 'No industry'}
                                        onClick={() => navigateTo(`/organizations`)}
                                    />
                                )}
                            />
                        )}

                        {!Object.values(results).some((arr: any) => arr?.length > 0) && (
                            <div className="py-12 text-center">
                                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold">No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function ResultSection({ title, icon, items, render }: any) {
    return (
        <div className="p-2">
            <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                {icon} {title}
            </div>
            {items.map(render)}
        </div>
    );
}

function ResultItem({ title, sub, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all rounded-2xl group text-left"
        >
            <div>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</h4>
                <p className="text-[10px] font-black text-slate-400 mt-0.5 uppercase tracking-widest leading-none">{sub}</p>
            </div>
            <ArrowRight size={16} className="text-slate-200 group-hover:text-blue-600 transition-all transform group-hover:translate-x-1" />
        </button>
    );
}
