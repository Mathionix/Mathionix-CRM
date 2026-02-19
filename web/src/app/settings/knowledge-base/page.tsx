"use client";

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Filter, MoreVertical, Edit2, Trash2, ExternalLink, ScrollText, FolderOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Article {
    _id: string;
    title: string;
    status: string;
    category: {
        name: string;
    };
    author: {
        firstName: string;
        lastName: string;
    };
    viewCount: number;
    updatedAt: string;
}

interface Category {
    _id: string;
    name: string;
    description: string;
    icon: string;
}

export default function KnowledgeBaseManagementPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const [artRes, catRes] = await Promise.all([
                fetch('http://localhost:3001/knowledge-base/articles', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/knowledge-base/categories', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (artRes.ok) setArticles(await artRes.json());
            if (catRes.ok) setCategories(await catRes.json());
        } catch (err) {
            console.error('Failed to fetch KB data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={20} className="text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Knowledge Base</h1>
                        <p className="text-slate-500 mt-2 font-medium">Create and manage documentation for your team and customers.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95">
                        <Plus size={18} />
                        {activeTab === 'articles' ? 'New Article' : 'New Category'}
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-2 bg-slate-50/50 flex border-b border-slate-50">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'articles' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <ScrollText size={16} />
                        Articles
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'categories' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <FolderOpen size={16} />
                        Categories
                    </button>
                </div>

                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-12 pr-4 py-3.5 w-full bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="p-8 animate-pulse bg-white h-24" />)
                    ) : activeTab === 'articles' ? (
                        filteredArticles.length === 0 ? (
                            <div className="py-20 text-center opacity-40">
                                <ScrollText size={48} className="mx-auto mb-4" />
                                <p className="font-bold">No articles found</p>
                            </div>
                        ) : (
                            filteredArticles.map(article => (
                                <div key={article._id} className="p-6 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <ScrollText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{article.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{article.category?.name}</span>
                                                <span className="text-slate-200">•</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By {article.author?.firstName}</span>
                                                <span className="text-slate-200">•</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{article.viewCount} Views</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        categories.map(category => (
                            <div key={category._id} className="p-6 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                        <FolderOpen size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{category.name}</h3>
                                        <p className="text-xs font-medium text-slate-500 mt-1">{category.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl text-slate-400 hover:text-purple-600 transition-all shadow-sm">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
