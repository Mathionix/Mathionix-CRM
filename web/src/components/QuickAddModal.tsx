"use client";

import { useState, useEffect } from 'react';
import { X, User, Building2, Handshake, Users, FileText, CheckCircle, PhoneCall } from 'lucide-react';

interface QuickAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'Lead' | 'Deal' | 'Org' | 'Contact' | 'Note' | 'Task' | 'Call';
}

export default function QuickAddModal({ isOpen, onClose, initialTab = 'Lead' }: QuickAddModalProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [loading, setLoading] = useState(false);

    // Sync activeTab with initialTab when modal opens or initialTab changes
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        const endpoint = activeTab === 'Lead' ? 'leads' :
            activeTab === 'Deal' ? 'deals' :
                activeTab === 'Org' ? 'organizations' :
                    activeTab === 'Contact' ? 'contacts' : 'activities';

        // Adjust data structure for activities
        let payload: any = data;
        if (['Note', 'Task', 'Call'].includes(activeTab)) {
            payload = {
                type: activeTab,
                title: data.title || `${activeTab} ${new Date().toLocaleDateString()}`,
                content: data.content || data.description || '',
                meta: data
            };
        }

        try {
            const res = await fetch(`http://localhost:3001/crm/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                onClose();
                window.location.reload();
            }
        } catch (err) {
            console.error('Failed to create record', err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { name: 'Lead', icon: Users, color: 'text-blue-600' },
        { name: 'Deal', icon: Handshake, color: 'text-amber-600' },
        { name: 'Org', icon: Building2, color: 'text-purple-600' },
        { name: 'Contact', icon: User, color: 'text-emerald-600' },
        { name: 'Note', icon: FileText, color: 'text-slate-600' },
        { name: 'Task', icon: CheckCircle, color: 'text-indigo-600' },
        { name: 'Call', icon: PhoneCall, color: 'text-rose-600' },
    ];

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col">
                <div className="p-8 pb-4 shrink-0">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quick Add</h2>
                            <p className="text-slate-500 text-sm font-medium">Create a new CRM record or log an activity</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex gap-1 mb-2 bg-slate-50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name as any)}
                                    className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-black transition-all ${isActive ? `bg-white shadow-sm ${tab.color}` : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <Icon size={14} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {activeTab === 'Lead' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Salutation" name="salutation" type="select" options={['Mr', 'Ms', 'Mrs', 'Dr']} />
                                <FormItem label="Email" name="email" type="email" required placeholder="email@example.com" />
                                <FormItem label="First Name" name="firstName" required placeholder="John" />
                                <FormItem label="Last Name" name="lastName" placeholder="Doe" />
                                <FormItem label="Mobile No" name="mobileNo" placeholder="+91 0000000000" />
                                <FormItem label="Gender" name="gender" type="select" options={['Male', 'Female', 'Other']} />
                                <FormItem label="Organization" name="organization" placeholder="Company Name" />
                                <FormItem label="Territory" name="territory" placeholder="e.g. India" />
                                <FormItem label="Website" name="website" placeholder="https://..." />
                                <FormItem label="Annual Revenue" name="annualRevenue" type="number" placeholder="₹ 0.00" />
                                <FormItem label="No. of Employees" name="noOfEmployees" type="select" options={['1-10', '11-50', '51-200', '201-500', '500+']} />
                                <FormItem label="Industry" name="industry" placeholder="e.g. Technology" />
                                <FormItem label="Status" name="status" type="select" options={['New', 'Qualified', 'Replied', 'Opportunity']} defaultValue="New" />
                                <FormItem label="Lead Owner" name="leadOwner" defaultValue="Administrator" />
                            </div>
                        )}

                        {activeTab === 'Deal' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Organization" name="organization" type="select" options={['Existing Org 1', 'Existing Org 2']} />
                                <FormItem label="Contact" name="contactPerson" type="select" options={['John Doe', 'Jane Smith']} />
                                <FormItem label="Deal Title" name="title" required placeholder="Enterprise Deal" />
                                <FormItem label="Amount" name="dealValue" type="number" required placeholder="₹ 0.00" />
                                <FormItem label="Territory" name="territory" placeholder="e.g. India" />
                                <FormItem label="Website" name="website" placeholder="https://..." />
                                <FormItem label="Annual Revenue" name="annualRevenue" type="number" placeholder="₹ 0.00" />
                                <FormItem label="No. of Employees" name="noOfEmployees" type="select" options={['1-10', '11-50', '51-200', '201-500', '500+']} />
                                <FormItem label="Industry" name="industry" placeholder="e.g. Technology" />
                                <FormItem label="Status" name="status" type="select" options={['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost']} defaultValue="Qualification" />
                                <FormItem label="Deal Owner" name="dealOwner" defaultValue="Administrator" />
                            </div>
                        )}

                        {activeTab === 'Org' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Organization name" name="name" required className="col-span-2" />
                                <FormItem label="Website" name="website" placeholder="https://..." />
                                <FormItem label="Annual revenue" name="annualRevenue" type="number" placeholder="₹ 0.00" />
                                <FormItem label="Territory" name="territory" />
                                <FormItem label="No. of employees" name="noOfEmployees" type="select" options={['1-10', '11-50', '51-200', '201-500', '500+']} />
                                <FormItem label="Industry" name="industry" />
                                <FormItem label="Address" name="address" className="col-span-2" />
                            </div>
                        )}

                        {activeTab === 'Contact' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Salutation" name="salutation" type="select" options={['Mr', 'Ms', 'Mrs', 'Dr']} />
                                <FormItem label="First Name" name="firstName" required />
                                <FormItem label="Last Name" name="lastName" />
                                <FormItem label="Email Address" name="email" type="email" required />
                                <FormItem label="Mobile No" name="mobileNo" />
                                <FormItem label="Gender" name="gender" type="select" options={['Male', 'Female', 'Other']} />
                                <FormItem label="Company Name" name="organization" />
                                <FormItem label="Designation" name="jobTitle" />
                                <FormItem label="Address" name="address" className="col-span-2" />
                            </div>
                        )}

                        {activeTab === 'Note' && (
                            <div className="space-y-4">
                                <FormItem label="Title (required)" name="title" required placeholder="Call with John Doe" />
                                <FormItem label="Content" name="content" type="textarea" placeholder="Detailed notes about the meeting..." />
                            </div>
                        )}

                        {activeTab === 'Task' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Title (required)" name="title" required className="col-span-2" />
                                <FormItem label="Description" name="description" type="textarea" className="col-span-2" />
                                <FormItem label="Status" name="status" type="select" options={['Backlog', 'Open', 'In Progress', 'Completed']} defaultValue="Backlog" />
                                <FormItem label="Priority" name="priority" type="select" options={['Low', 'Medium', 'High']} defaultValue="Low" />
                                <FormItem label="Due Date" name="dueDate" type="date" />
                                <FormItem label="Owner" name="owner" defaultValue="Administrator" />
                            </div>
                        )}

                        {activeTab === 'Call' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Type" name="type" type="select" options={['Inbound', 'Outbound']} />
                                <FormItem label="From" name="from" placeholder="Administrator" />
                                <FormItem label="To" name="to" placeholder="Contact Name" />
                                <FormItem label="Duration" name="duration" type="number" placeholder="Seconds" />
                                <FormItem label="Status" name="status" type="select" options={['Completed', 'Missed', 'Busy', 'Failed']} defaultValue="Completed" />
                            </div>
                        )}

                        <div className="pt-4 sticky bottom-0 bg-white border-t border-slate-50 mt-auto">
                            <button
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' :
                                    activeTab === 'Lead' ? 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700' :
                                        activeTab === 'Deal' ? 'bg-amber-600 shadow-amber-500/20 hover:bg-amber-700' :
                                            activeTab === 'Org' ? 'bg-purple-600 shadow-purple-500/20 hover:bg-purple-700' :
                                                activeTab === 'Contact' ? 'bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-700' :
                                                    activeTab === 'Note' ? 'bg-slate-700 shadow-slate-500/20 hover:bg-slate-800' :
                                                        activeTab === 'Task' ? 'bg-indigo-600 shadow-indigo-500/20 hover:bg-indigo-700' :
                                                            'bg-rose-600 shadow-rose-500/20 hover:bg-rose-700'
                                    }`}
                            >
                                {loading ? 'Processing...' : activeTab === 'Call' ? 'Log Call' : `Create ${activeTab}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function FormItem({ label, name, type = 'text', options = [], placeholder = '', required = false, className = '', defaultValue = '' }: any) {
    return (
        <div className={`space-y-1 ${className}`}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            {type === 'select' ? (
                <select name={name} required={required} defaultValue={defaultValue} className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer">
                    {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : type === 'textarea' ? (
                <textarea name={name} required={required} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[100px]" placeholder={placeholder} />
            ) : (
                <input name={name} type={type} required={required} defaultValue={defaultValue} className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder={placeholder} />
            )}
        </div>
    );
}
