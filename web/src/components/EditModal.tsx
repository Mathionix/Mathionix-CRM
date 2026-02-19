"use client";

import { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertCircle } from 'lucide-react';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'Lead' | 'Deal' | 'Org' | 'Contact' | 'Note' | 'Task' | 'Call' | string;
    initialData: any;
    onSuccess?: () => void;
}

export default function EditModal({ isOpen, onClose, type, initialData, onSuccess }: EditModalProps) {
    const [loading, setLoading] = useState(false);
    const [customFields, setCustomFields] = useState<any[]>([]);
    const [pipelines, setPipelines] = useState<any[]>([]);
    const [selectedPipeline, setSelectedPipeline] = useState<string>('');

    useEffect(() => {
        if (isOpen && type) {
            fetchCustomFields();
            if (type === 'Deal') {
                fetchPipelines();
            }
        }
    }, [isOpen, type]);

    useEffect(() => {
        if (type === 'Deal') {
            if (initialData && initialData.pipeline) {
                setSelectedPipeline(initialData.pipeline);
            } else if (pipelines.length > 0 && !selectedPipeline) {
                // If editing a legacy deal with no pipeline, default to first or default pipeline
                // Ideally we shouldn't auto-assign on edit unless user saves, but for UI state we need a value.
                const defaultP = pipelines.find((p: any) => p.isDefault) || pipelines[0];
                if (defaultP) setSelectedPipeline(defaultP._id);
            }
        }
    }, [initialData, pipelines, type]);

    const fetchPipelines = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3001/crm/pipelines', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPipelines(data);
            }
        } catch (err) {
            console.error('Failed to fetch pipelines:', err);
        }
    };

    const fetchCustomFields = async () => {
        const moduleMap: any = { 'Lead': 'leads', 'Deal': 'deals', 'Org': 'organizations', 'Contact': 'contacts' };
        const moduleName = moduleMap[type];
        if (!moduleName) {
            setCustomFields([]);
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/custom-fields?module=${moduleName}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCustomFields(data);
            } else {
                setCustomFields([]);
            }
        } catch (err) {
            console.error('Failed to fetch custom fields:', err);
            setCustomFields([]);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        const endpoint = type === 'Lead' ? 'leads' :
            type === 'Deal' ? 'deals' :
                type === 'Org' ? 'organizations' :
                    type === 'Contact' ? 'contacts' : 'activities'; // Basic mapping

        // Extract custom fields
        const customFieldsData: any = {};
        customFields.forEach(field => {
            const fieldName = `cf_${field.key}`;
            if (data[fieldName]) {
                customFieldsData[field.key] = data[fieldName];
                delete data[fieldName];
            }
        });

        let payload: any = { ...data };
        if (Object.keys(customFieldsData).length > 0) {
            payload.customFields = customFieldsData;
        }

        if (type === 'Deal' && payload.status) {
            payload.stage = payload.status;
            delete payload.status;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3001/crm/${endpoint}/${initialData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                if (onSuccess) onSuccess();
                onClose();
            } else {
                const errorData = await res.json();
                alert(`Failed to update: ${errorData.message || res.statusText}`);
            }
        } catch (err) {
            console.error('Update failed', err);
            alert('Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        setLoading(true);
        const endpoint = type === 'Lead' ? 'leads' :
            type === 'Deal' ? 'deals' :
                type === 'Org' ? 'organizations' :
                    type === 'Contact' ? 'contacts' : 'activities';

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3001/crm/${endpoint}/${initialData._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                if (onSuccess) onSuccess();
                onClose();
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currentPipeline = pipelines.find(p => p._id === selectedPipeline);
    const stageOptions = currentPipeline ? currentPipeline.stages.sort((a: any, b: any) => a.order - b.order).map((s: any) => s.name) : [];

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col">
                <div className="p-8 pb-4 shrink-0 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Edit {type}</h2>
                        <p className="text-slate-500 text-sm font-medium">Update record details</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-xl transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="edit-form" onSubmit={handleSubmit} className="space-y-5">
                        {type === 'Lead' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Salutation" name="salutation" type="select" options={['Mr', 'Ms', 'Mrs', 'Dr']} defaultValue={initialData.salutation} />
                                <FormItem label="Email" name="email" type="email" required defaultValue={initialData.email} />
                                <FormItem label="First Name" name="firstName" required defaultValue={initialData.firstName} />
                                <FormItem label="Last Name" name="lastName" defaultValue={initialData.lastName} />
                                <FormItem label="Mobile No" name="mobileNo" defaultValue={initialData.mobileNo} />
                                <FormItem label="Gender" name="gender" type="select" options={['Male', 'Female', 'Other']} defaultValue={initialData.gender} />
                                <FormItem label="Organization" name="organization" defaultValue={initialData.organization} />
                                <FormItem label="Territory" name="territory" defaultValue={initialData.territory} />
                                <FormItem label="Website" name="website" defaultValue={initialData.website} />
                                <FormItem label="Annual Revenue" name="annualRevenue" type="number" defaultValue={initialData.annualRevenue} />
                                <FormItem label="No. of Employees" name="noOfEmployees" type="select" options={['1-10', '11-50', '51-200', '201-500', '500+']} defaultValue={initialData.noOfEmployees} />
                                <FormItem label="Industry" name="industry" defaultValue={initialData.industry} />
                                <FormItem label="Status" name="status" type="select" options={['New', 'Qualified', 'Replied', 'Opportunity']} defaultValue={initialData.status} />
                                <FormItem label="Lead Owner" name="leadOwner" defaultValue={initialData.leadOwner} />
                                {customFields.map(field => (
                                    <FormItem
                                        key={field._id}
                                        label={field.name}
                                        name={`cf_${field.key}`}
                                        type={field.type}
                                        options={field.options}
                                        required={field.required}
                                        defaultValue={initialData.customFields?.[field.key]}
                                    />
                                ))}
                            </div>
                        )}

                        {type === 'Deal' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Deal Title" name="title" required defaultValue={initialData.title} />
                                <FormItem label="Amount" name="dealValue" type="number" required defaultValue={initialData.dealValue} />

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Pipeline</label>
                                    <select
                                        name="pipeline"
                                        value={selectedPipeline}
                                        onChange={(e) => setSelectedPipeline(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                                    >
                                        {pipelines.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <FormItem label="Stage" name="status" type="select" options={stageOptions} defaultValue={initialData.status} />

                                <FormItem label="Probability (%)" name="probability" type="number" defaultValue={initialData.probability} />
                                <FormItem label="Organization" name="organization" defaultValue={initialData.organization} />
                                <FormItem label="Contact Person" name="contactPerson" defaultValue={initialData.contactPerson} />
                                <FormItem label="Expected Close Date" name="expectedClosureDate" type="date" defaultValue={initialData.expectedClosureDate?.split('T')[0]} />
                                <FormItem label="Next Step" name="nextStep" defaultValue={initialData.nextStep} />
                                <FormItem label="Deal Owner" name="dealOwner" defaultValue={initialData.dealOwner} />
                                {customFields.map(field => (
                                    <FormItem
                                        key={field._id}
                                        label={field.name}
                                        name={`cf_${field.key}`}
                                        type={field.type}
                                        options={field.options}
                                        required={field.required}
                                        defaultValue={initialData.customFields?.[field.key]}
                                    />
                                ))}
                            </div>
                        )}

                        {type === 'Org' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Organization name" name="name" required className="col-span-2" defaultValue={initialData.name} />
                                <FormItem label="Website" name="website" defaultValue={initialData.website} />
                                <FormItem label="Annual revenue" name="annualRevenue" type="number" defaultValue={initialData.annualRevenue} />
                                <FormItem label="Territory" name="territory" defaultValue={initialData.territory} />
                                <FormItem label="No. of employees" name="noOfEmployees" type="select" options={['1-10', '11-50', '51-200', '201-500', '500+']} defaultValue={initialData.noOfEmployees} />
                                <FormItem label="Industry" name="industry" defaultValue={initialData.industry} />
                                <FormItem label="Address" name="address" className="col-span-2" defaultValue={initialData.address} />
                                {customFields.map(field => (
                                    <FormItem
                                        key={field._id}
                                        label={field.name}
                                        name={`cf_${field.key}`}
                                        type={field.type}
                                        options={field.options}
                                        required={field.required}
                                        defaultValue={initialData.customFields?.[field.key]}
                                        className={field.type === 'textarea' ? 'col-span-2' : ''}
                                    />
                                ))}
                            </div>
                        )}

                        {type === 'Contact' && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <FormItem label="Salutation" name="salutation" type="select" options={['Mr', 'Ms', 'Mrs', 'Dr']} defaultValue={initialData.salutation} />
                                <FormItem label="First Name" name="firstName" required defaultValue={initialData.firstName} />
                                <FormItem label="Last Name" name="lastName" defaultValue={initialData.lastName} />
                                <FormItem label="Email Address" name="email" type="email" required defaultValue={initialData.email} />
                                <FormItem label="Mobile No" name="mobileNo" defaultValue={initialData.mobileNo} />
                                <FormItem label="Gender" name="gender" type="select" options={['Male', 'Female', 'Other']} defaultValue={initialData.gender} />
                                <FormItem label="Company Name" name="organization" defaultValue={initialData.organization} />
                                <FormItem label="Designation" name="jobTitle" defaultValue={initialData.jobTitle} />
                                <FormItem label="Address" name="address" className="col-span-2" defaultValue={initialData.address} />
                                {customFields.map(field => (
                                    <FormItem
                                        key={field._id}
                                        label={field.name}
                                        name={`cf_${field.key}`}
                                        type={field.type}
                                        options={field.options}
                                        required={field.required}
                                        defaultValue={initialData.customFields?.[field.key]}
                                        className={field.type === 'textarea' ? 'col-span-2' : ''}
                                    />
                                ))}
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="edit-form"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white bg-slate-900 shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormItem({ label, name, type = 'text', options = [], placeholder = '', required = false, className = '', defaultValue = '' }: any) {
    return (
        <div className={`space-y-1 ${className}`}>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            {type === 'select' ? (
                <select name={name} required={required} defaultValue={defaultValue} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                    {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : type === 'textarea' ? (
                <textarea name={name} required={required} defaultValue={defaultValue} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px]" placeholder={placeholder} />
            ) : (
                <input name={name} type={type} required={required} defaultValue={defaultValue} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder={placeholder} />
            )}
        </div>
    );
}
