"use client";

import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-fixed">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-2xl shadow-blue-500/5">
                    {!submitted ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recover Password</h1>
                                <p className="text-slate-500 mt-2 font-medium text-sm">Enter your email and we'll send you a link to reset your password.</p>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="admin@mathionix.crm"
                                            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] group">
                                    Send reset link
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                                <Mail size={40} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Check your email</h2>
                            <p className="text-slate-500 mt-4 font-medium text-sm leading-relaxed px-4">
                                We've sent a password reset link to your email address. It may take a couple of minutes to arrive.
                            </p>
                            <button onClick={() => setSubmitted(false)} className="mt-8 text-sm font-black text-blue-600 hover:text-blue-700">
                                Didn't receive it? Try again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
