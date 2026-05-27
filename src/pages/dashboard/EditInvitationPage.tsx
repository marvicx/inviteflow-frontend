import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, Plus, Trash2, Upload, ImageIcon, Check, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { invitationsApi, uploadApi } from '@/lib/api';
import { HEADER_PRESETS } from '@/pages/PublicInvitePage';

const DECORATION_OPTIONS = [
    { value: 'lavender', label: 'Lavender' },
    { value: 'rose', label: 'Rose' },
    { value: 'eucalyptus', label: 'Eucalyptus' },
    { value: 'none', label: 'None' },
] as const;
type Decoration = typeof DECORATION_OPTIONS[number]['value'];

const schema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    eventDate: z.string().optional(),
    eventTime: z.string().optional(),
    location: z.string().optional(),
    locationUrl: z.string().optional(),
    rsvpDeadline: z.string().optional(),
    maxGuests: z.coerce.number().min(1).max(10000).optional(),
});
type FormValues = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

type DraftFaq = { question: string; answer: string };

type DraftQuestion = {
    questionText: string;
    questionType: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX';
    options: string[];
    isRequired: boolean;
};

function toDatetimeLocal(isoString?: string) {
    if (!isoString) return '';
    const d = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditInvitationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['invitation', id],
        queryFn: () => invitationsApi.get(id!),
        enabled: !!id,
    });

    const inv = data?.data?.invitation;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues, undefined, FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (inv) {
            reset({
                title: inv.title,
                description: inv.description ?? '',
                eventDate: toDatetimeLocal(inv.eventDate),
                eventTime: inv.eventTime ?? '',
                location: inv.location ?? '',
                locationUrl: inv.locationUrl ?? '',
                rsvpDeadline: toDatetimeLocal(inv.rsvpDeadline),
                maxGuests: inv.maxGuests ?? undefined,
            });
        }
    }, [inv, reset]);

    const [headerBg, setHeaderBg] = useState('#FAF8F5');
    const [headerDecoration, setHeaderDecoration] = useState<Decoration>('lavender');
    const [carouselImages, setCarouselImages] = useState<string[]>([]);
    const [uploadingCarousel, setUploadingCarousel] = useState(false);
    const carouselInputRef = useRef<HTMLInputElement>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Sync gallery + carousel + header from loaded invitation
    useEffect(() => {
        if (inv) {
            setGallery(inv.gallery ?? []);
            setCarouselImages(inv.carouselImages ?? []);
            const p = (inv.customColors as Record<string, string> | null) ?? {};
            const legacyPreset = HEADER_PRESETS[p.headerPreset ?? 'floral-lavender'] ?? HEADER_PRESETS['floral-lavender'];
            setHeaderBg(p.headerBg ?? legacyPreset.bg);
            setHeaderDecoration((p.headerDecoration ?? legacyPreset.decoration ?? 'lavender') as Decoration);
        }
    }, [inv?.id]);

    const { mutate: updateInvitation, isPending } = useMutation({
        mutationFn: (formData: FormData) =>
            invitationsApi.update(id!, {
                ...formData,
                eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : undefined,
                rsvpDeadline: formData.rsvpDeadline ? new Date(formData.rsvpDeadline).toISOString() : undefined,
                carouselImages,
                gallery,
                customColors: {
                    ...((inv?.customColors as Record<string, string>) ?? {}),
                    headerBg,
                    headerDecoration,
                },
            }),
        onSuccess: () => {
            toast.success('Invitation updated!');
            qc.invalidateQueries({ queryKey: ['invitation', id] });
            navigate(`/dashboard/invitations/${id}`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.error || err?.response?.data?.message || 'Update failed');
        },
    });

    const handleCarouselUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        setUploadingCarousel(true);
        try {
            const urls = await Promise.all(files.map(f => uploadApi.image(f).then(r => r.data.url)));
            setCarouselImages(prev => [...prev, ...urls]);
            toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} added to slideshow`);
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploadingCarousel(false);
            if (carouselInputRef.current) carouselInputRef.current.value = '';
        }
    };

    const removeCarouselImage = (index: number) => {
        setCarouselImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        setUploadingGallery(true);
        try {
            const urls = await Promise.all(files.map(f => uploadApi.image(f).then(r => r.data.url)));
            setGallery(prev => [...prev, ...urls]);
            toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} added`);
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploadingGallery(false);
            if (galleryInputRef.current) galleryInputRef.current.value = '';
        }
    };

    const removeGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    const [addingQuestion, setAddingQuestion] = useState(false);
    const [draftQ, setDraftQ] = useState<DraftQuestion>({
        questionText: '', questionType: 'TEXT', options: ['Option 1'], isRequired: false,
    });

    // â”€â”€ FAQ state â”€â”€
    const [addingFaq, setAddingFaq] = useState(false);
    const [draftFaq, setDraftFaq] = useState<DraftFaq>({ question: '', answer: '' });

    const { mutate: addFaq, isPending: addingFaqPending } = useMutation({
        mutationFn: (f: DraftFaq) => invitationsApi.addFaq(id!, { ...f, sortOrder: (inv?.faqs?.length ?? 0) }),
        onSuccess: () => {
            toast.success('Q&A item added!');
            qc.invalidateQueries({ queryKey: ['invitation', id] });
            setDraftFaq({ question: '', answer: '' });
            setAddingFaq(false);
        },
        onError: () => toast.error('Failed to add Q&A item'),
    });

    const { mutate: deleteFaq } = useMutation({
        mutationFn: (faqId: string) => invitationsApi.deleteFaq(id!, faqId),
        onSuccess: () => {
            toast.success('Q&A item removed');
            qc.invalidateQueries({ queryKey: ['invitation', id] });
        },
        onError: () => toast.error('Failed to remove Q&A item'),
    });

    const { mutate: addQuestion, isPending: addingQ } = useMutation({
        mutationFn: (q: DraftQuestion) => invitationsApi.addQuestion(id!, q),
        onSuccess: () => {
            toast.success('Question added!');
            qc.invalidateQueries({ queryKey: ['invitation', id] });
            setDraftQ({ questionText: '', questionType: 'TEXT', options: ['Option 1'], isRequired: false });
            setAddingQuestion(false);
        },
        onError: () => toast.error('Failed to add question'),
    });

    const { mutate: deleteQuestion } = useMutation({
        mutationFn: (questionId: string) => invitationsApi.deleteQuestion(id!, questionId),
        onSuccess: () => {
            toast.success('Question removed');
            qc.invalidateQueries({ queryKey: ['invitation', id] });
        },
        onError: () => toast.error('Failed to remove question'),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Edit invitation</h1>
            </div>

            <form onSubmit={handleSubmit((d) => updateInvitation(d))} className="card p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                    <input {...register('title')} className="input-base w-full" />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea {...register('description')} rows={3} className="input-base w-full resize-none" />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Event date</label>
                        <input {...register('eventDate')} type="datetime-local" className="input-base w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Event time (optional)</label>
                        <input {...register('eventTime')} type="time" className="input-base w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">RSVP deadline</label>
                        <input {...register('rsvpDeadline')} type="datetime-local" className="input-base w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Max guests</label>
                        <input {...register('maxGuests')} type="number" className="input-base w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                        <input {...register('location')} className="input-base w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location URL (Google Maps)</label>
                        <input {...register('locationUrl')} type="url" className="input-base w-full" placeholder="https://maps.google.com/..." />
                    </div>
                </div>

                {/* Header Background Color */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Header background color
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            value={headerBg}
                            onChange={(e) => setHeaderBg(e.target.value)}
                            className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                        />
                        <div
                            className="flex-1 h-10 rounded-lg border border-gray-100 flex items-center px-3"
                            style={{ background: headerBg }}
                        >
                            <span className="text-xs font-mono font-semibold mix-blend-difference text-white select-all">
                                {headerBg.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Quick presets</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(HEADER_PRESETS).map((p) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    title={p.label}
                                    onClick={() => { setHeaderBg(p.bg.startsWith('linear') ? '#FAF8F5' : p.bg); setHeaderDecoration(p.decoration as Decoration); }}
                                    className="w-7 h-7 rounded-full border-2 border-white shadow hover:scale-110 transition-transform"
                                    style={{ background: p.bg.startsWith('linear') ? p.accent : p.bg, outline: `2px solid ${p.border}` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Botanical decoration</p>
                        <div className="flex gap-2 flex-wrap">
                            {DECORATION_OPTIONS.map((d) => (
                                <button
                                    key={d.value}
                                    type="button"
                                    onClick={() => setHeaderDecoration(d.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${headerDecoration === d.value
                                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                                    }`}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={isPending} className="btn-primary inline-flex">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save changes
                    </button>
                </div>
            </form>

            {/* Custom questions */}
            <div className="card p-8 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Custom questions</h2>
                <p className="text-sm text-gray-500">Questions guests will answer when they RSVP.</p>

                {(inv?.questions ?? []).length > 0 && (
                    <div className="space-y-3">
                        {(inv!.questions as any[]).map((q: any) => (
                            <div key={q.id} className="flex items-start justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900 text-sm">{q.question}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400">{(q.type ?? '').replace('_', ' ')}</span>
                                        {q.required && <span className="badge text-xs bg-red-50 text-red-500">Required</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteQuestion(q.id)}
                                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                                    title="Delete question"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {addingQuestion ? (
                    <div className="p-5 rounded-2xl border-2 border-primary/20 space-y-4">
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
                                    <button type="button" onClick={() => setDraftQ((q) => ({ ...q, options: [...q.options, ''] }))} className="text-sm text-primary hover:underline">
                                        + Add option
                                    </button>
                                </div>
                            </div>
                        )}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={draftQ.isRequired} onChange={(e) => setDraftQ((q) => ({ ...q, isRequired: e.target.checked }))} className="accent-primary" />
                            <span className="text-sm text-gray-700">Required question</span>
                        </label>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setAddingQuestion(false)} className="btn-ghost flex-1">Cancel</button>
                            <button
                                type="button"
                                disabled={addingQ}
                                onClick={() => {
                                    if (!draftQ.questionText.trim()) { toast.error('Enter a question'); return; }
                                    addQuestion(draftQ);
                                }}
                                className="btn-primary flex-1 inline-flex justify-center"
                            >
                                {addingQ ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add question</>}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setAddingQuestion(true)}
                        className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 text-gray-400 hover:text-primary transition-all text-sm font-medium inline-flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add a question
                    </button>
                )}
            </div>

            {/* ── Carousel / Slideshow Photos ── */}
            <div className="card p-8 space-y-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Slideshow photos</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Photos that cycle on the left panel of your invitation. The cover image always appears first.
                    </p>
                </div>

                {carouselImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {carouselImages.map((url, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden aspect-4/3 bg-gray-100">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeCarouselImage(i)}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-1 left-1 bg-black/40 text-white text-xs px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                    {i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <input
                    ref={carouselInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleCarouselUpload}
                />
                <button
                    type="button"
                    disabled={uploadingCarousel}
                    onClick={() => carouselInputRef.current?.click()}
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 text-gray-400 hover:text-primary transition-all text-sm font-medium inline-flex items-center justify-center gap-2"
                >
                    {uploadingCarousel
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading&hellip;</>
                        : <><Upload className="w-4 h-4" /> Add slideshow photos</>
                    }
                </button>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                    <ImageIcon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-600">
                        Saved when you click <strong>Save changes</strong> above.
                    </p>
                </div>
            </div>

            {/* ── Gallery / Wedding Details images ── */}
            <div className="card p-8 space-y-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Wedding details images</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Upload images for your entourage list, dress code card, map, etc. These appear in the "Wedding Details" section.
                    </p>
                </div>

                {gallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {gallery.map((url, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden aspect-4/3 bg-gray-100">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeGalleryImage(i)}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-1 left-1 bg-black/40 text-white text-xs px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                    {i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                />
                <button
                    type="button"
                    disabled={uploadingGallery}
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 text-gray-400 hover:text-primary transition-all text-sm font-medium inline-flex items-center justify-center gap-2"
                >
                    {uploadingGallery
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploadingâ€¦</>
                        : <><Upload className="w-4 h-4" /> Upload images</>
                    }
                </button>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                    <ImageIcon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-600">
                        Images are saved when you click <strong>Save changes</strong> on the main form above.
                        Drag to reorder is coming soon.
                    </p>
                </div>
            </div>

            {/* â”€â”€ Q & A â”€â”€ */}
            <div className="card p-8 space-y-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        Q &amp; A
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Pre-written answers to common guest questions. Shown as an accordion on your invitation.</p>
                </div>

                {(inv?.faqs ?? []).length > 0 && (
                    <div className="space-y-3">
                        {(inv!.faqs as any[]).map((faq: any) => (
                            <div key={faq.id} className="flex items-start justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900 text-sm">{faq.question}</p>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{faq.answer}</p>
                                </div>
                                <button
                                    onClick={() => deleteFaq(faq.id)}
                                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {addingFaq ? (
                    <div className="p-5 rounded-2xl border-2 border-primary/20 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Question *</label>
                            <input
                                value={draftFaq.question}
                                onChange={(e) => setDraftFaq((f) => ({ ...f, question: e.target.value }))}
                                placeholder="e.g. When is the RSVP deadline?"
                                className="input-base w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Answer *</label>
                            <textarea
                                value={draftFaq.answer}
                                onChange={(e) => setDraftFaq((f) => ({ ...f, answer: e.target.value }))}
                                rows={3}
                                placeholder="e.g. Please RSVP by March 1st so we can finalize the headcount."
                                className="input-base w-full resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setAddingFaq(false)} className="btn-ghost flex-1">Cancel</button>
                            <button
                                type="button"
                                disabled={addingFaqPending}
                                onClick={() => {
                                    if (!draftFaq.question.trim() || !draftFaq.answer.trim()) {
                                        toast.error('Both question and answer are required');
                                        return;
                                    }
                                    addFaq(draftFaq);
                                }}
                                className="btn-primary flex-1 inline-flex justify-center"
                            >
                                {addingFaqPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add Q&A</>}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setAddingFaq(true)}
                        className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 text-gray-400 hover:text-primary transition-all text-sm font-medium inline-flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Q&amp;A item
                    </button>
                )}
            </div>
        </div>
    );
}


