"use client";

import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-fixed">
            <div className="w-full max-w-md text-center bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-2xl shadow-blue-500/5">
                <div className="inline-flex w-14 h-14 bg-white border border-slate-100 rounded-2xl items-center justify-center shadow-xl shadow-blue-500/10 mb-6 overflow-hidden">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Invitation Only</h1>
                <p className="text-slate-500 font-medium mb-6">
                    Public registration is currently disabled.<br />
                    Please contact your administrator to request an account.
                </p>
                <div>
                    <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
