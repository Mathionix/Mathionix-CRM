"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
    PhoneCall,
    Settings,
    UserCheck,
    TrendingUp,
    X,
    Lock as LockIcon
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: TrendingUp },
    { name: 'Clients', href: '/clients', icon: UserCheck },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Deals', href: '/deals', icon: Handshake },
    { name: 'Organizations', href: '/organizations', icon: Building2 },
    { name: 'Contacts', href: '/contacts', icon: Contact },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Tasks', href: '/tasks', icon: CheckCircle },
    { name: 'Call Logs', href: '/calls', icon: PhoneCall },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('user');
        if (saved) {
            try {
                setUser(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        }
    }, []);

    const isAdmin = user?.role === 'Admin' || user?.role === 'administrator';

    const triggerQuickAdd = (type: string) => {
        window.dispatchEvent(new CustomEvent('trigger-quick-add', { detail: { type } }));
        setIsCreateOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/auth/login';
    };

    const getPermissionForLink = (name: string) => {
        const map: any = {
            'Dashboard': 'dashboard:read',
            'Reports': 'reports:read',
            'Clients': 'clients:read',
            'Leads': 'leads:read',
            'Deals': 'deals:read',
            'Organizations': 'organizations:read',
            'Contacts': 'contacts:read',
            'Notes': 'activities:read',
            'Tasks': 'activities:read',
            'Call Logs': 'activities:read',
            'Settings': 'settings:write'
        };
        return map[name];
    };

    const hasAccess = (name: string) => {
        if (isAdmin) return true;
        const permission = getPermissionForLink(name);
        if (!permission) return true;

        // Extract permission names from the user's role
        // Handle cases where roleId is populated (object) or just an ID (string)
        // Note: For real-time permission updates, the user object in localStorage needs to be fresh
        const roleObj = user?.roleId || user?.role;
        let userPermissions: string[] = [];

        if (roleObj && typeof roleObj === 'object') {
            userPermissions = roleObj.permissions?.map((p: any) =>
                typeof p === 'string' ? p : p.name
            ) || [];
        }

        // If we have no permission list and we're not admin, default to looking at legacy role strings
        // for basic access if applicable, but here we strictly follow the RBAC permissions
        return userPermissions.includes(permission);
    };

    return (
        <div className="w-68 bg-[#0f172a] text-slate-300 h-screen flex flex-col shadow-2xl z-20 transition-all duration-300">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/10 border border-slate-700">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-lg text-white tracking-tight">Mathionix CRM</span>
            </div>


            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">Main Menu</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const locked = !hasAccess(item.name);

                    return (
                        <div key={item.name} className="relative group">
                            <Link
                                href={locked ? '#' : item.href}
                                onClick={(e) => locked && e.preventDefault()}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-blue-600/10 text-blue-400 font-semibold shadow-inner'
                                    : locked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-slate-800/50 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                                <span className="text-[14px]">{item.name}</span>
                                {locked && <LockIcon size={14} className="ml-auto text-slate-600" />}
                                {isActive && !locked && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-glow" />}
                            </Link>

                            {locked && (
                                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl border border-slate-700 pointer-events-none">
                                    Only you permissions to these for more access please request admin.
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-800/50 space-y-2">
                <div className="px-4 py-2 flex items-center gap-3 text-slate-500 italic text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    System Online
                </div>
            </div>
        </div>
    );
}
