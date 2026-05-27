import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, Crown, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { templatesApi, invitationsApi } from '@/lib/api';

const step2Schema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    eventDate: z.string().min(1, 'Event date is required'),
    eventLocation: z.string().optional(),
    rsvpDeadline: z.string().optional(),
    maxGuests: z.coerce.number().min(1).max(10000).optional(),
});
type Step2Data = z.infer<typeof step2Schema>;

type DraftQuestion = {
    questionText: string;
    questionType: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX';
    options: string[];
    isRequired: boolean;
};

const steps = ['Template', 'Event Details', 'Questions', 'Publish'];

function getApiErrorMessage(err: any, fallback: string) {
    const data = err?.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.error && typeof data.error === 'string') return data.error;
    if (data?.message && typeof data.message === 'string') return data.message;
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first === 'string') return first;
        if (typeof first?.message === 'string') return first.message;
    }
    return fallback;
}

export function CreateInvitationPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [limitError, setLimitError] = useState<string | null>(null);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [questions, setQuestions] = useState<DraftQuestion[]>([]);
    const [addingQuestion, setAddingQuestion] = useState(false);
    const [draftQ, setDraftQ] = useState<DraftQuestion>({
        questionText: '', questionType: 'TEXT', options: ['Option 1'], isRequired: false,
    });

    const { data: templatesData, isLoading: loadingTemplates } = useQuery({
        queryKey: ['templates'],
        queryFn: () => templatesApi.list(),
    });
    const templates = templatesData?.data?.templates ?? [];

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
    });

    const { mutate: createInvitation, isPending } = useMutation({
        mutationFn: async (data: any) => {
            const res = await invitationsApi.create(data);
            const invId = res.data.invitation.id;
            let failedQuestions = 0;
            if (questions.length > 0) {
                const questionPayloads = questions.map((q, index) => ({
                    question: q.questionText,
                    type: q.questionType,
                    options: q.questionType === 'TEXT' ? undefined : q.options.filter((o) => o.trim().length > 0),
                    required: q.isRequired,
                    sortOrder: index,
                }));
                const results = await Promise.allSettled(
                    questionPayloads.map((q) => invitationsApi.addQuestion(invId, q)),
                );
                failedQuestions = results.filter((r) => r.status === 'rejected').length;
            }
            return { res, failedQuestions };
        },
        onSuccess: ({ res, failedQuestions }) => {
            if (failedQuestions > 0) {
                toast.warning(`Invitation created, but ${failedQuestions} question(s) were not saved.`);
            } else {
                toast.success('Invitation created! 🎉');
            }
            navigate(`/dashboard/invitations/${res.data.invitation.id}`);
        },
        onError: (err: any) => {
            const message = getApiErrorMessage(err, 'Failed to create invitation');
            if (err?.response?.status === 403 && /free plan allows up to 3 invitations/i.test(message)) {
                setLimitError(message);
                setShowLimitModal(true);
                toast.error(message);
                return;
            }
            toast.error(message);
        },
    });

    const onFinalSubmit = (formData: Step2Data) => {
        setLimitError(null);
        createInvitation({
            templateId: selectedTemplate?.id,
            ...formData,
            location: formData.eventLocation,
            eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : undefined,
            rsvpDeadline: formData.rsvpDeadline ? new Date(formData.rsvpDeadline).toISOString() : undefined,
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence>
                {showLimitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowLimitModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Plan Limit Reached</h3>
                            <p className="text-sm text-gray-600 mb-5">
                                {limitError ?? 'Free plan allows up to 3 invitations. Upgrade to Pro for unlimited.'}
                            </p>
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-5 text-sm text-amber-800">
                                Tip: Delete an old invitation to create a new one, or upgrade for unlimited events.
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLimitModal(false)}
                                    className="btn-ghost flex-1"
                                >
                                    Stay on page
                                </button>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="btn-primary flex-1 inline-flex justify-center"
                                >
                                    View pricing
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div>
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Create invitation</h1>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-3">
                {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'bg-[#43B89C] text-white' : i === step ? 'bg-[#6C63FF] text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {i < step ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-sm ${i === step ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{s}</span>
                        {i < steps.length - 1 && <div className={`flex-1 h-px w-8 ${i < step ? 'bg-[#43B89C]' : 'bg-gray-200'}`} />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Step 0: Template picker */}
                {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <p className="text-gray-500 mb-6">Choose a template to get started, or skip for a blank invitation.</p>
                        {loadingTemplates ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl shimmer" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                                {templates.map((t: any) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t)}
                                        className={`relative rounded-2xl overflow-hidden border-2 transition-all ${selectedTemplate?.id === t.id ? 'border-[#6C63FF] shadow-lg shadow-[#6C63FF]/20' : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="h-40">
                                            <img src={t.thumbnailUrl} alt={t.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-3 text-left bg-white">
                                            <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                                            <p className="text-xs text-gray-400">{t.category}</p>
                                        </div>
                                        {t.isPremium && (
                                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full text-xs font-bold">
                                                <Crown className="w-2.5 h-2.5" /> PRO
                                            </div>
                                        )}
                                        {selectedTemplate?.id === t.id && (
                                            <div className="absolute top-2 left-2 w-6 h-6 bg-[#6C63FF] rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between">
                            <button onClick={() => setStep(1)} className="btn-ghost text-gray-500">Skip template</button>
                            <button onClick={() => setStep(1)} disabled={!selectedTemplate} className="btn-primary inline-flex disabled:opacity-50">
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 1: Event details */}
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <form onSubmit={handleSubmit(() => setStep(2))} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Invitation title *</label>
                                    <input {...register('title')} placeholder="e.g. Sarah & James Wedding" className="input-base w-full" />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                    <textarea {...register('description')} placeholder="A brief message for your guests…" rows={3} className="input-base w-full resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Event date *</label>
                                    <input {...register('eventDate')} type="datetime-local" className="input-base w-full" />
                                    {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">RSVP deadline</label>
                                    <input {...register('rsvpDeadline')} type="datetime-local" className="input-base w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                    <input {...register('eventLocation')} placeholder="Grand Ballroom, New York" className="input-base w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Max guests</label>
                                    <input {...register('maxGuests')} type="number" placeholder="100" className="input-base w-full" />
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button type="button" onClick={() => setStep(0)} className="btn-ghost inline-flex">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <button type="submit" className="btn-primary inline-flex">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Step 2: Custom questions */}
                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <p className="text-gray-500 mb-6">Add custom questions for your guests to answer when they RSVP. This is optional.</p>
                        <div className="space-y-3 mb-6">
                            {questions.map((q, idx) => (
                                <div key={idx} className="card p-4 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">{q.questionText}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400">{q.questionType.replace('_', ' ')}</span>
                                            {q.isRequired && <span className="badge text-xs bg-red-50 text-red-500">Required</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => setQuestions((qs) => qs.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {addingQuestion ? (
                                <div className="card p-5 border-2 border-[#6C63FF]/20 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Question *</label>
                                        <input
                                            value={draftQ.questionText}
                                            onChange={(e) => setDraftQ((q) => ({ ...q, questionText: e.target.value }))}
                                            placeholder="e.g. Any dietary restrictions?"
                                            className="input-base w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                                        <select
                                            value={draftQ.questionType}
                                            onChange={(e) => setDraftQ((q) => ({ ...q, questionType: e.target.value as DraftQuestion['questionType'], options: ['Option 1'] }))}
                                            className="input-base w-full"
                                        >
                                            <option value="TEXT">Text answer</option>
                                            <option value="MULTIPLE_CHOICE">Multiple choice (pick one)</option>
                                            <option value="CHECKBOX">Checkboxes (pick many)</option>
                                        </select>
                                    </div>
                                    {(draftQ.questionType === 'MULTIPLE_CHOICE' || draftQ.questionType === 'CHECKBOX') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                                            <div className="space-y-2">
                                                {draftQ.options.map((opt, i) => (
                                                    <div key={i} className="flex gap-2">
                                                        <input
                                                            value={opt}
                                                            onChange={(e) => setDraftQ((q) => { const opts = [...q.options]; opts[i] = e.target.value; return { ...q, options: opts }; })}
                                                            placeholder={`Option ${i + 1}`}
                                                            className="input-base flex-1"
                                                        />
                                                        {draftQ.options.length > 1 && (
                                                            <button type="button" onClick={() => setDraftQ((q) => ({ ...q, options: q.options.filter((_, j) => j !== i) }))} className="text-gray-300 hover:text-red-400">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => setDraftQ((q) => ({ ...q, options: [...q.options, ''] }))} className="text-sm text-[#6C63FF] hover:underline">
                                                    + Add option
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={draftQ.isRequired} onChange={(e) => setDraftQ((q) => ({ ...q, isRequired: e.target.checked }))} className="accent-[#6C63FF]" />
                                        <span className="text-sm text-gray-700">Required question</span>
                                    </label>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setAddingQuestion(false)} className="btn-ghost flex-1">Cancel</button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!draftQ.questionText.trim()) { toast.error('Enter a question'); return; }
                                                setQuestions((qs) => [...qs, { ...draftQ }]);
                                                setDraftQ({ questionText: '', questionType: 'TEXT', options: ['Option 1'], isRequired: false });
                                                setAddingQuestion(false);
                                            }}
                                            className="btn-primary flex-1 inline-flex justify-center"
                                        >
                                            <Plus className="w-4 h-4" /> Add question
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAddingQuestion(true)}
                                    className="w-full card p-4 border-2 border-dashed border-gray-200 hover:border-[#6C63FF]/40 text-gray-400 hover:text-[#6C63FF] transition-all text-sm font-medium inline-flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add a question
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setStep(1)} className="btn-ghost inline-flex"><ArrowLeft className="w-4 h-4" /> Back</button>
                            <button onClick={() => setStep(3)} className="btn-primary inline-flex">Continue <ArrowRight className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Confirm & publish */}
                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {limitError && (
                            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <p className="text-sm font-medium text-amber-900">Free plan limit reached.</p>
                                <p className="text-sm text-amber-800 mt-1">{limitError}</p>
                            </div>
                        )}
                        <div className="card p-8 mb-6">
                            <h3 className="font-bold text-gray-900 text-lg mb-4">Review your invitation</h3>
                            <dl className="space-y-3">
                                <div className="flex gap-4">
                                    <dt className="text-sm text-gray-500 w-32">Title</dt>
                                    <dd className="text-sm font-medium text-gray-900">{getValues('title')}</dd>
                                </div>
                                {getValues('eventDate') && (
                                    <div className="flex gap-4">
                                        <dt className="text-sm text-gray-500 w-32">Event date</dt>
                                        <dd className="text-sm font-medium text-gray-900">{new Date(getValues('eventDate')).toLocaleString()}</dd>
                                    </div>
                                )}
                                {getValues('eventLocation') && (
                                    <div className="flex gap-4">
                                        <dt className="text-sm text-gray-500 w-32">Location</dt>
                                        <dd className="text-sm font-medium text-gray-900">{getValues('eventLocation')}</dd>
                                    </div>
                                )}
                                {selectedTemplate && (
                                    <div className="flex gap-4">
                                        <dt className="text-sm text-gray-500 w-32">Template</dt>
                                        <dd className="text-sm font-medium text-gray-900">{selectedTemplate.name}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="flex justify-between">
                            <button onClick={() => setStep(2)} className="btn-ghost inline-flex">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={handleSubmit(onFinalSubmit)}
                                disabled={isPending}
                                className="btn-primary inline-flex"
                            >
                                {isPending ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                                ) : (
                                    <>Create as draft <Check className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
