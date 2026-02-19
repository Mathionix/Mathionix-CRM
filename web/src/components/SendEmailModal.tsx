"use client";

import { useState, useEffect } from 'react';
import { X, Send, Mail, User, Info, AlertCircle, Loader2 } from 'lucide-react';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientEmail: string;
    recipientName: string;
    module: string;
    entityId: string;
}

export default function SendEmailModal({ isOpen, onClose, recipientEmail, recipientName, module, entityId }: SendEmailModalProps) {
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen]);

    const fetchTemplates = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/email-templates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch (err) {
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        const template = templates.find(t => t._id === templateId);
        if (template) {
            setSubject(template.subject);
            // Simple variable replacement on frontend for preview
            let filledBody = template.body.replace(/\{\{firstName\}\}/g, recipientName.split(' ')[0]);
            filledBody = filledBody.replace(/\{\{fullName\}\}/g, recipientName);
            setBody(filledBody);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/communications/emails/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipient: recipientEmail,
                    subject,
                    body,
                    module,
                    entityId
                })
            });
            if (res.ok) {
                onClose();
            }
        } catch (err) {
            console.error('Failed to send email:', err);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col">
                <div className="p-8 pb-4 shrink-0 border-b border-slate-50">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-inner">
                                <Mail size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Send Email</h2>
                                <p className="text-slate-500 text-sm font-medium">To: <span className="text-slate-900 font-bold">{recipientName}</span> ({recipientEmail})</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
                    <form id="email-form" onSubmit={handleSend} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Choose Template</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => handleTemplateChange(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Custom Email (No Template)</option>
                                {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email subject..."
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Message Body</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Type your message here..."
                                className="w-full bg-slate-50 border-none rounded-[32px] py-6 px-6 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all min-h-[300px] leading-relaxed"
                                required
                            />
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-4 flex items-start gap-3 border border-blue-50">
                            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-blue-600/80 leading-normal">
                                You can use placeholders like <code className="bg-blue-100 px-1 rounded">{"{{firstName}}"}</code> or <code className="bg-blue-100 px-1 rounded">{"{{fullName}}"}</code> in your templates for personalization.
                            </p>
                        </div>
                    </form>
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4.5 rounded-2xl font-black text-slate-500 bg-white border border-slate-100 hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                        Save Draft
                    </button>
                    <button
                        type="submit"
                        form="email-form"
                        disabled={sending}
                        className="flex-[2] py-4.5 rounded-2xl font-black text-white bg-slate-900 hover:bg-black shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                Send Email
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
