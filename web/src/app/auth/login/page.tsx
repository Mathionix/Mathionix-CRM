"use client";

import Link from 'next/link';
import { Mail, Lock, ArrowRight, Github, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                document.cookie = `token=${data.access_token}; path=/`; // For middleware if needed
                router.push('/');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-fixed overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -ml-64 -mb-64" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <div className="inline-flex w-14 h-14 bg-white border border-slate-100 rounded-2xl items-center justify-center shadow-xl shadow-blue-500/10 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden">
                        <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2 font-medium">Log in to your Mathionix CRM portal</p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-2xl shadow-blue-500/5">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@mathionix.crm"
                                    required
                                    className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                                <Link href="/auth/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-12 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Get Started'}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Restricted Access</p>
                        <p className="text-xs text-slate-500 mt-1">Please log in with your provided credentials.</p>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm font-medium">
                    Don't have an account? <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline">Sign up now</Link>
                </p>
            </div>
        </div>
    );
}
