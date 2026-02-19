"use client";

import Link from 'next/link';
import { Layout, Columns, Shield, UserCircle, Key, BookOpen, Mail, Share2, GitBranch, Users, ChevronRight } from 'lucide-react';

const settingsModules = [
    {
        name: 'User Management',
        description: 'Add, remove, and manage your team members.',
        href: '/settings/users',
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        name: 'Roles & Permissions',
        description: 'Define job functions and control granular action access.',
        href: '/settings/roles-permissions',
        icon: Shield,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    },
    {
        name: 'Custom Fields',
        description: 'Create dynamic properties for CRM modules.',
        href: '/settings/custom-fields',
        icon: Layout,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        name: 'Columns',
        description: 'Customize which columns are visible in list views.',
        href: '/settings/columns',
        icon: Columns,
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    },
    {
        name: 'Pipelines',
        description: 'Configure sales workflows and stages.',
        href: '/settings/pipelines',
        icon: GitBranch,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
    },
    {
        name: 'Integrations',
        description: 'Connect external tools and platforms.',
        href: '/settings/integrations',
        icon: Share2,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    },
    {
        name: 'Audit Logs',
        description: 'Track system activities and changes.',
        href: '/settings/audit-logs',
        icon: Shield,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        name: 'Knowledge Base',
        description: 'Manage help articles and documentation.',
        href: '/settings/knowledge-base',
        icon: BookOpen,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    },
    {
        name: 'Email Templates',
        description: 'Create reusable email templates.',
        href: '/settings/email-templates',
        icon: Mail,
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    }
];

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage your organization's configuration and security.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsModules.map((module) => {
                    const Icon = module.icon;
                    return (
                        <Link
                            key={module.name}
                            href={module.href}
                            className="group bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all active:scale-[0.98] flex flex-col items-start gap-4"
                        >
                            <div className={`p-3 rounded-2xl ${module.bg} ${module.color} transition-colors group-hover:scale-110 duration-300`}>
                                <Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{module.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{module.description}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 mt-2 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                Go to {module.name} <ChevronRight size={14} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full -mr-32 -mt-32" />
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Workspace Personalization</h2>
                    <p className="text-slate-400 text-sm max-w-lg mb-6 leading-relaxed">Customize fields, columns, and brand settings to make Mathionix CRM truly yours.</p>
                    <button className="px-6 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
                        View Personalization Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
