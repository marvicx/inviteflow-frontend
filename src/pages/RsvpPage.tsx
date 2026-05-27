import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { invitationsApi, guestsApi } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    rsvpStatus: z.enum(['YES', 'NO', 'MAYBE']),
    plusOnes: z.coerce.number().min(0).max(10).optional(),
    message: z.string().max(500).optional(),
});
type FormValues = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

export function RsvpPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['public-invite', slug],
        queryFn: () => invitationsApi.getPublic(slug!),
        enabled: !!slug,
    });

    const inv = data?.data?.invitation;

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues, undefined, FormData>({
        resolver: zodResolver(schema),
        defaultValues: { rsvpStatus: 'YES', plusOnes: 0 },
    });

    const rsvpStatus = watch('rsvpStatus');

    const [questionResponses, setQuestionResponses] = useState<Record<string, string | string[]>>({});

    const setTextResponse = (qId: string, val: string) =>
        setQuestionResponses((prev) => ({ ...prev, [qId]: val }));

    const toggleCheckbox = (qId: string, option: string) =>
        setQuestionResponses((prev) => {
            const current = (prev[qId] as string[]) ?? [];
            return {
                ...prev,
                [qId]: current.includes(option)
                    ? current.filter((o) => o !== option)
                    : [...current, option],
            };
        });

    const buildResponses = () =>
        (inv?.questions ?? []).flatMap((q: any) => {
            const raw = questionResponses[q.id];
            if (q.questionType === 'CHECKBOX') {
                const selected = (raw as string[] | undefined) ?? [];
                return selected.length ? [{ questionId: q.id, answer: selected.join(', ') }] : [];
            }
            const answer = (raw as string | undefined) ?? '';
            return answer ? [{ questionId: q.id, answer }] : [];
        });

    const { mutate: submitRsvp, isPending } = useMutation({
        mutationFn: (formData: FormData) =>
            guestsApi.rsvp({
                invitationSlug: slug,
                ...formData,
                responses: buildResponses(),
            }),
        onSuccess: () => {
            navigate(`/invite/${slug}/confirmed`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to submit RSVP');
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!inv) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Invitation not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F7FF] py-12 px-4">
            <div className="max-w-lg mx-auto">
                <Link
                    to={`/invite/${slug}`}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to invitation
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-8"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">RSVP</h1>
                    <p className="text-gray-500 mb-8">
                        Responding to: <span className="font-medium text-gray-900">{inv.title}</span>
                    </p>

                    <form onSubmit={handleSubmit((d) => submitRsvp(d))} className="space-y-6">
                        {/* Attendance */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Will you attend?</label>
                            <div className="grid grid-cols-3 gap-3">
                                {([
                                    { value: 'YES', label: '✅ Yes!', active: 'bg-green-500 text-white border-green-500' },
                                    { value: 'MAYBE', label: '🤔 Maybe', active: 'bg-yellow-400 text-white border-yellow-400' },
                                    { value: 'NO', label: '❌ No', active: 'bg-red-400 text-white border-red-400' },
                                ] as const).map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${rsvpStatus === opt.value ? opt.active : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <input {...register('rsvpStatus')} type="radio" value={opt.value} className="sr-only" />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name *</label>
                            <input {...register('name')} placeholder="Alex Chen" className="input-base w-full" autoComplete="name" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                            <input {...register('email')} type="email" placeholder="you@example.com" className="input-base w-full" autoComplete="email" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        {rsvpStatus === 'YES' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Plus ones <span className="text-gray-400">(guests you're bringing)</span>
                                </label>
                                <input {...register('plusOnes')} type="number" min={0} max={10} placeholder="0" className="input-base w-32" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Message <span className="text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                {...register('message')}
                                rows={3}
                                placeholder="Leave a message for the host…"
                                className="input-base w-full resize-none"
                            />
                        </div>

                        {/* Custom questions */}
                        {(inv?.questions ?? []).length > 0 && (
                            <div className="space-y-5 pt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Additional questions</p>
                                {(inv.questions as any[]).map((q: any) => (
                                    <div key={q.id}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {q.questionText}
                                            {q.isRequired && <span className="text-red-500 ml-0.5">*</span>}
                                        </label>

                                        {q.questionType === 'TEXT' && (
                                            <textarea
                                                rows={2}
                                                className="input-base w-full resize-none"
                                                value={(questionResponses[q.id] as string) ?? ''}
                                                onChange={(e) => setTextResponse(q.id, e.target.value)}
                                            />
                                        )}

                                        {q.questionType === 'MULTIPLE_CHOICE' && (
                                            <div className="space-y-2">
                                                {(q.options as string[]).map((opt: string) => (
                                                    <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name={`q_${q.id}`}
                                                            value={opt}
                                                            checked={(questionResponses[q.id] as string) === opt}
                                                            onChange={() => setTextResponse(q.id, opt)}
                                                            className="accent-[#6C63FF] w-4 h-4"
                                                        />
                                                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {q.questionType === 'CHECKBOX' && (
                                            <div className="space-y-2">
                                                {(q.options as string[]).map((opt: string) => {
                                                    const checked = ((questionResponses[q.id] as string[]) ?? []).includes(opt);
                                                    return (
                                                        <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => toggleCheckbox(q.id, opt)}
                                                                className="accent-[#6C63FF] w-4 h-4"
                                                            />
                                                            <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="submit" disabled={isPending} className="btn-primary w-full py-3 text-base">
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting…
                                </span>
                            ) : (
                                'Submit RSVP'
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
