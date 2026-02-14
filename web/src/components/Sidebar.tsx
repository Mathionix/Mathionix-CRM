"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    BarChart3,
    Users,
    Handshake,
    Building2,
    Contact,
    Plus,
    Bell,
    Search,
    ChevronDown,
    FileText,
    CheckCircle,
    PhoneCall
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Deals', href: '/deals', icon: Handshake },
    { name: 'Organizations', href: '/organizations', icon: Building2 },
    { name: 'Contacts', href: '/contacts', icon: Contact },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Tasks', href: '/tasks', icon: CheckCircle },
    { name: 'Call Logs', href: '/calls', icon: PhoneCall },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const triggerQuickAdd = (type: string) => {
        window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type } }));
        setIsCreateOpen(false);
    };

    return (
        <div className="w-68 bg-[#0f172a] text-slate-300 h-screen flex flex-col shadow-2xl z-20 transition-all duration-300">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <span className="font-black text-lg">M</span>
                </div>
                <span className="font-bold text-lg text-white tracking-tight">Mathionix CRM</span>
            </div>


            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">Main Menu</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600/10 text-blue-400 font-semibold shadow-inner'
                                : 'hover:bg-slate-800/50 hover:text-white'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} />
                            <span className="text-[14px]">{item.name}</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-glow" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-800/50">
                <div className="px-4 py-3 flex items-center gap-3 text-slate-500 italic text-[11px]">
                    <Bell size={14} /> System Online
                </div>
            </div>
        </div>
    );
}
