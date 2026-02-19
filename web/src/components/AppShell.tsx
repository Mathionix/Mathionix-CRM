"use client";

import Sidebar from './Sidebar';
import { Bell, HelpCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import QuickAddModal from './QuickAddModal';
import GlobalSearch from './GlobalSearch';
import { useState, useEffect } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [quickAddType, setQuickAddType] = useState<'Lead' | 'Deal' | 'Org' | 'Contact' | 'Note' | 'Task' | 'Call'>('Lead');

    // Subscribe to custom event for global Quick Add trigger
    useEffect(() => {
        const handleTrigger = (e: any) => {
            setQuickAddType(e.detail.type || 'Lead');
            setIsQuickAddOpen(true);
        };
        window.addEventListener('trigger-quick-add', handleTrigger);
        return () => window.removeEventListener('trigger-quick-add', handleTrigger);
    }, []);

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 justify-between shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-6 flex-1">
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => alert("No new notifications")}
                            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors group"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                            <HelpCircle size={20} />
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-1" />
                        <div className="relative group/profile">
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1.5 rounded-xl transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-blue-500/20">
                                    AD
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-semibold text-slate-800 leading-none">Admin User</p>
                                    <p className="text-[10px] text-slate-500 font-medium mt-1">Super Admin</p>
                                </div>
                            </div>

                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 invisible opacity-0 group-hover/profile:visible group-hover/profile:opacity-100 transition-all duration-200 z-50">
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                                        window.location.href = '/auth/login';
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-slate-50 font-bold transition-colors text-left"
                                >
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>

            <QuickAddModal
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
                initialTab={quickAddType}
            />
        </div>
    );
}
