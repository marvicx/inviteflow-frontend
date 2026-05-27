import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { invitationsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

// â”€â”€â”€ Header Background Presets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const HEADER_PRESETS: Record<string, {
    bg: string;
    text: string;
    subtext: string;
    accent: string;
    border: string;
    label: string;
    decoration: 'lavender' | 'rose' | 'eucalyptus' | 'none';
}> = {
    'floral-lavender': {
        bg: '#FAF8F5',
        text: '#2C2422',
        subtext: '#6B5B5B',
        accent: '#7C6FA0',
        border: '#D4C9E0',
        label: 'Floral Lavender',
        decoration: 'lavender',
    },
    'floral-rose': {
        bg: '#FFF5F7',
        text: '#3D1A22',
        subtext: '#7B4A55',
        accent: '#C8607A',
        border: '#F0C0CC',
        label: 'Floral Rose',
        decoration: 'rose',
    },
    'floral-eucalyptus': {
        bg: '#F4F8F4',
        text: '#1E2E1E',
        subtext: '#4A6050',
        accent: '#5A8060',
        border: '#B8D4B8',
        label: 'Eucalyptus',
        decoration: 'eucalyptus',
    },
    'classic-ivory': {
        bg: '#FEFDF8',
        text: '#1A1A1A',
        subtext: '#5A5040',
        accent: '#8B7355',
        border: '#E8E0C8',
        label: 'Classic Ivory',
        decoration: 'none',
    },
    'navy-gold': {
        bg: '#1B2B4B',
        text: '#F5EDD0',
        subtext: '#C8B880',
        accent: '#C8A96E',
        border: '#3B4B6B',
        label: 'Navy & Gold',
        decoration: 'none',
    },
    'blush-warm': {
        bg: 'linear-gradient(135deg, #FFF0E8 0%, #FFE0D0 100%)',
        text: '#3D1800',
        subtext: '#8B5A40',
        accent: '#C87050',
        border: '#F0C0A0',
        label: 'Warm Blush',
        decoration: 'rose',
    },
    'sage-green': {
        bg: 'linear-gradient(135deg, #F0F5EE 0%, #E0EBE0 100%)',
        text: '#1A2A1A',
        subtext: '#406040',
        accent: '#5A8A5A',
        border: '#B0C8B0',
        label: 'Sage Green',
        decoration: 'eucalyptus',
    },
};

// â”€â”€â”€ SVG Decorations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LavenderDecoration({ position }: { position: 'top-right' | 'bottom-left' }) {
    if (position === 'top-right') {
        return (
            <svg className="absolute top-0 right-0 w-36 h-36 pointer-events-none" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M144 0 Q120 20 100 40 Q80 60 90 80" stroke="#B5C9A0" strokeWidth="1.5" fill="none" opacity="0.7" />
                <ellipse cx="112" cy="18" rx="7" ry="12" fill="#8FB878" opacity="0.5" transform="rotate(-30 112 18)" />
                <ellipse cx="128" cy="28" rx="6" ry="11" fill="#A0C890" opacity="0.5" transform="rotate(-20 128 28)" />
                <ellipse cx="100" cy="35" rx="8" ry="13" fill="#78A860" opacity="0.4" transform="rotate(-45 100 35)" />
                <ellipse cx="118" cy="45" rx="5" ry="10" fill="#90B878" opacity="0.45" transform="rotate(-15 118 45)" />
                <path d="M95 55 Q98 45 101 35" stroke="#9080B8" strokeWidth="1.2" fill="none" opacity="0.6" />
                <circle cx="95" cy="54" r="3.5" fill="#B090D0" opacity="0.55" />
                <circle cx="97" cy="49" r="3" fill="#A880C8" opacity="0.5" />
                <circle cx="99" cy="44" r="2.5" fill="#9870B8" opacity="0.45" />
                <circle cx="101" cy="39" r="2" fill="#8860A8" opacity="0.4" />
                <path d="M105 60 Q108 50 111 40" stroke="#9080B8" strokeWidth="1.2" fill="none" opacity="0.6" />
                <circle cx="105" cy="59" r="3" fill="#B090D0" opacity="0.5" />
                <circle cx="107" cy="54" r="2.5" fill="#A080C0" opacity="0.45" />
                <circle cx="109" cy="49" r="2" fill="#9070B0" opacity="0.4" />
                <circle cx="111" cy="44" r="1.5" fill="#8060A0" opacity="0.35" />
            </svg>
        );
    }
    return (
        <svg className="absolute bottom-0 left-0 w-40 h-24 pointer-events-none" viewBox="0 0 160 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 96 Q30 80 60 70 Q90 60 120 70 Q140 75 160 80" stroke="#B5C9A0" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M10 96 Q15 82 18 70" stroke="#9080B8" strokeWidth="1.2" fill="none" opacity="0.6" />
            <circle cx="10" cy="95" r="3.5" fill="#B090D0" opacity="0.5" />
            <circle cx="13" cy="89" r="3" fill="#A880C8" opacity="0.45" />
            <circle cx="15" cy="83" r="2.5" fill="#9870B8" opacity="0.4" />
            <circle cx="17" cy="77" r="2" fill="#8060A0" opacity="0.35" />
            <path d="M28 96 Q32 83 35 72" stroke="#9080B8" strokeWidth="1.2" fill="none" opacity="0.55" />
            <circle cx="28" cy="95" r="3" fill="#B090D0" opacity="0.45" />
            <circle cx="30" cy="89" r="2.5" fill="#A080C0" opacity="0.4" />
            <circle cx="33" cy="84" r="2" fill="#9070B0" opacity="0.35" />
            <ellipse cx="50" cy="88" rx="8" ry="5" fill="#8FB878" opacity="0.35" transform="rotate(-10 50 88)" />
            <ellipse cx="70" cy="82" rx="9" ry="5.5" fill="#A0C890" opacity="0.3" transform="rotate(5 70 82)" />
        </svg>
    );
}

function RoseDecoration({ position }: { position: 'top-right' | 'bottom-left' }) {
    if (position === 'top-right') {
        return (
            <svg className="absolute top-0 right-0 w-36 h-36 pointer-events-none" viewBox="0 0 144 144" fill="none">
                <path d="M144 0 Q115 25 95 50" stroke="#D4A0A0" strokeWidth="1.5" fill="none" opacity="0.6" />
                <circle cx="110" cy="25" r="8" fill="#F0B0B8" opacity="0.45" />
                <circle cx="110" cy="25" r="5" fill="#E89098" opacity="0.5" />
                <circle cx="128" cy="18" r="6" fill="#F8C0C8" opacity="0.4" />
                <circle cx="128" cy="18" r="3.5" fill="#E8A0A8" opacity="0.45" />
                <circle cx="120" cy="42" r="7" fill="#F0A8B0" opacity="0.4" />
                <circle cx="120" cy="42" r="4.5" fill="#E09098" opacity="0.45" />
                <ellipse cx="118" cy="60" rx="6" ry="9" fill="#78A860" opacity="0.4" transform="rotate(-30 118 60)" />
                <ellipse cx="102" cy="68" rx="7" ry="10" fill="#90B878" opacity="0.35" transform="rotate(15 102 68)" />
            </svg>
        );
    }
    return (
        <svg className="absolute bottom-0 left-0 w-40 h-24 pointer-events-none" viewBox="0 0 160 96" fill="none">
            <ellipse cx="20" cy="85" rx="7" ry="10" fill="#78A860" opacity="0.35" transform="rotate(-15 20 85)" />
            <ellipse cx="40" cy="80" rx="8" ry="11" fill="#90B878" opacity="0.3" transform="rotate(5 40 80)" />
            <circle cx="65" cy="78" r="7" fill="#F0B0B8" opacity="0.4" />
            <circle cx="65" cy="78" r="4.5" fill="#E89098" opacity="0.45" />
            <circle cx="90" cy="72" r="6" fill="#F8C0C8" opacity="0.35" />
            <circle cx="90" cy="72" r="3.5" fill="#E8A0A8" opacity="0.4" />
        </svg>
    );
}

function EucalyptusDecoration({ position }: { position: 'top-right' | 'bottom-left' }) {
    if (position === 'top-right') {
        return (
            <svg className="absolute top-0 right-0 w-40 h-40 pointer-events-none" viewBox="0 0 160 160" fill="none">
                <path d="M160 0 Q130 30 105 55 Q85 75 80 100" stroke="#8AB890" strokeWidth="2" fill="none" opacity="0.6" />
                <ellipse cx="138" cy="20" rx="10" ry="6" fill="#88B880" opacity="0.45" transform="rotate(-40 138 20)" />
                <ellipse cx="150" cy="32" rx="9" ry="5.5" fill="#98C890" opacity="0.4" transform="rotate(-30 150 32)" />
                <ellipse cx="122" cy="38" rx="11" ry="6.5" fill="#78A870" opacity="0.4" transform="rotate(-55 122 38)" />
                <ellipse cx="135" cy="52" rx="9" ry="5.5" fill="#90B880" opacity="0.4" transform="rotate(-45 135 52)" />
                <ellipse cx="112" cy="60" rx="10" ry="6" fill="#80A870" opacity="0.38" transform="rotate(-60 112 60)" />
                <ellipse cx="125" cy="72" rx="8" ry="5" fill="#88B878" opacity="0.35" transform="rotate(-40 125 72)" />
                <ellipse cx="100" cy="82" rx="9" ry="5.5" fill="#78A068" opacity="0.32" transform="rotate(-65 100 82)" />
            </svg>
        );
    }
    return (
        <svg className="absolute bottom-0 left-0 w-44 h-28 pointer-events-none" viewBox="0 0 176 112" fill="none">
            <path d="M0 112 Q40 90 80 80 Q120 70 160 80" stroke="#8AB890" strokeWidth="2" fill="none" opacity="0.5" />
            <ellipse cx="15" cy="98" rx="10" ry="6" fill="#88B880" opacity="0.4" transform="rotate(15 15 98)" />
            <ellipse cx="35" cy="90" rx="11" ry="6.5" fill="#98C890" opacity="0.38" transform="rotate(-5 35 90)" />
            <ellipse cx="58" cy="86" rx="10" ry="6" fill="#78A870" opacity="0.36" transform="rotate(10 58 86)" />
            <ellipse cx="80" cy="82" rx="11" ry="6.5" fill="#90B880" opacity="0.34" transform="rotate(-8 80 82)" />
            <ellipse cx="104" cy="84" rx="9" ry="5.5" fill="#80A870" opacity="0.32" transform="rotate(5 104 84)" />
        </svg>
    );
}

// --- Color utilities ---------------------------------------------------
function hexLuminance(hex: string): number {
    const h = hex.replace('#', '');
    if (h.length !== 6) return 0.5;
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function deriveHeaderColors(bgHex: string) {
    const lum = hexLuminance(bgHex);
    const dark = lum < 0.35;
    return {
        bg: bgHex,
        text:    dark ? '#F5EDD0' : '#1A1A1A',
        subtext: dark ? '#C8B880' : '#5A5040',
        accent:  dark ? '#C8A96E' : '#8B7355',
        border:  dark ? '#3B4B6B' : '#E8E0C8',
    };
}

function HeaderDecorations({ decoration }: { decoration: string }) {
    if (decoration === 'lavender') {
        return (
            <>
                <LavenderDecoration position="top-right" />
                <LavenderDecoration position="bottom-left" />
            </>
        );
    }
    if (decoration === 'rose') {
        return (
            <>
                <RoseDecoration position="top-right" />
                <RoseDecoration position="bottom-left" />
            </>
        );
    }
    if (decoration === 'eucalyptus') {
        return (
            <>
                <EucalyptusDecoration position="top-right" />
                <EucalyptusDecoration position="bottom-left" />
            </>
        );
    }
    return null;
}

// â”€â”€â”€ Photo Carousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PhotoCarousel({
    images,
    coupleTitle,
    description,
    eventDate,
    slug,
    themeColor,
    status,
}: {
    images: string[];
    coupleTitle: string;
    description?: string | null;
    eventDate?: string | null;
    slug: string;
    themeColor: string;
    status: string;
}) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((i) => (i + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const photo = images[current];

    return (
        <div className="relative w-full h-full min-h-[70vh] md:min-h-screen overflow-hidden bg-gray-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    {photo ? (
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{ background: `linear-gradient(135deg, ${themeColor}88, ${themeColor}44)` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10" />
                    <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 pb-10 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl text-white mb-3 leading-tight"
                        style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
                    >
                        {coupleTitle}
                    </h1>
                    {description && (
                        <p
                            className="text-white/80 text-sm sm:text-base max-w-xs leading-relaxed mb-6"
                            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                        >
                            {description}
                        </p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                        {eventDate && (
                            <span className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5">
                                {formatDate(eventDate)}
                            </span>
                        )}
                        {status !== 'DRAFT' ? (
                            <Link
                                to={`/invite/${slug}/rsvp`}
                                className="px-6 py-2 rounded-full text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                                style={{ backgroundColor: themeColor, boxShadow: `0 4px 16px ${themeColor}66` }}
                            >
                                RSVP
                            </Link>
                        ) : (
                            <span className="px-6 py-2 rounded-full text-sm font-semibold bg-white/20 text-white/60 cursor-not-allowed">
                                RSVP (Preview)
                            </span>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Dot indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// â”€â”€â”€ Gallery Image with lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function GalleryImage({ url }: { url: string }) {
    const [lightbox, setLightbox] = useState(false);
    return (
        <>
            <button
                onClick={() => setLightbox(true)}
                className="w-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block text-left"
            >
                <img src={url} alt="" className="w-full h-auto object-cover" loading="lazy" />
            </button>
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(false)}
                    >
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={url}
                            alt=""
                            className="max-w-full max-h-full rounded-lg object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setLightbox(false)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl font-light leading-none"
                        >
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// â”€â”€â”€ FAQ Accordion item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FaqItem({ question, answer, accentColor }: { question: string; answer: string; accentColor: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-start justify-between gap-3 py-4 text-left"
            >
                <span className="text-gray-900 font-medium text-sm sm:text-base leading-snug">{question}</span>
                <span className="shrink-0 mt-0.5" style={{ color: accentColor }}>
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-gray-600 text-sm leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// â”€â”€â”€ Section Divider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SectionTitle({ title, headingFont }: { title: string; headingFont: string }) {
    return (
        <div className="text-center mb-6">
            <h2
                className="text-3xl sm:text-4xl font-bold text-gray-800 italic"
                style={{ fontFamily: `'${headingFont}', serif` }}
            >
                {title}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-2">
                <div className="h-px w-12 bg-gray-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <div className="h-px w-12 bg-gray-200" />
            </div>
        </div>
    );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function PublicInvitePage() {
    const { slug } = useParams<{ slug: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['public-invite', slug],
        queryFn: () => invitationsApi.getPublic(slug!),
        enabled: !!slug,
    });

    const inv = data?.data?.invitation;

    // Derive theme values
    const palette = (inv?.customColors ?? inv?.template?.colorPalette ?? {}) as Record<string, string>;
    const primaryColor: string = palette?.primary ?? '#6C63FF';
    // Header: free color (headerBg) takes priority; fall back to legacy preset
    const legacyPreset = HEADER_PRESETS[palette?.headerPreset ?? 'floral-lavender'] ?? HEADER_PRESETS['floral-lavender'];
    const headerBgColor: string = palette?.headerBg ?? legacyPreset.bg;
    const headerDecoration: string = palette?.headerDecoration ?? legacyPreset.decoration ?? 'lavender';
    const headerColors = deriveHeaderColors(headerBgColor);
    const headingFont: string =
        (inv?.customFonts as Record<string, string> | null)?.heading ??
        (inv?.template?.fontPair as { heading?: string } | null)?.heading ??
        'Playfair Display';

    // Carousel photos: coverImageUrl + carouselImages (NOT gallery)
    const carouselPhotos: string[] = [
        ...(inv?.coverImageUrl ? [inv.coverImageUrl] : []),
        ...(inv?.carouselImages ?? []),
    ];

    // Wedding details images (right panel)
    const galleryImages: string[] = inv?.gallery ?? [];

    const faqs: Array<{ id: string; question: string; answer: string }> = inv?.faqs ?? [];
    const location = inv?.location;
    const locationUrl = inv?.locationUrl;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
                    />
                    <p className="text-gray-400 text-sm">Loading invitation&hellip;</p>
                </div>
            </div>
        );
    }

    if (error || !inv) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center px-4">
                    <div className="text-6xl mb-4">&#128148;</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation not found</h1>
                    <p className="text-gray-500 mb-6">This invitation may have been removed or the link is incorrect.</p>
                    <Link to="/" className="btn-primary">Back to InviteFlow</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Draft banner */}
            {inv.status === 'DRAFT' && (
                <div className="fixed top-0 inset-x-0 z-50 bg-amber-400 text-amber-900 text-center text-sm font-semibold py-2 px-4">
                    &#9888; Preview mode &mdash; this invitation is a draft. Publish it to allow RSVPs.
                </div>
            )}

            {/* Desktop: side-by-side | Mobile: stacked */}
            <div className={`md:grid md:grid-cols-[52%_48%] md:min-h-screen ${inv.status === 'DRAFT' ? 'pt-9' : ''}`}>

                {/* LEFT: sticky photo panel */}
                <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
                    <PhotoCarousel
                        images={carouselPhotos}
                        coupleTitle={inv.title}
                        description={inv.description}
                        eventDate={inv.eventDate}
                        slug={slug!}
                        themeColor={primaryColor}
                        status={inv.status}
                    />
                </div>

                {/* RIGHT: scrollable content */}
                <div className="overflow-y-auto bg-white">

                    {/* 1 â”€â”€ Header: day / date / location */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden py-10 px-8 text-center"
                        style={{ background: headerColors.bg }}
                    >
                        <HeaderDecorations decoration={headerDecoration} />
                        <div className="relative z-10">
                            {inv.eventDate && (
                                <>
                                    <p
                                        className="text-base font-semibold tracking-wide mb-0.5"
                                        style={{ color: headerColors.subtext, fontFamily: `'${headingFont}', serif` }}
                                    >
                                        {new Date(inv.eventDate).toLocaleDateString('en-US', { weekday: 'long' })}
                                    </p>
                                    <h2
                                        className="text-3xl sm:text-4xl font-bold mb-2"
                                        style={{ color: headerColors.text, fontFamily: `'${headingFont}', serif` }}
                                    >
                                        {new Date(inv.eventDate).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </h2>
                                </>
                            )}
                            {location && (
                                <p className="text-base mb-6" style={{ color: headerColors.subtext }}>
                                    {location}
                                </p>
                            )}
                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                {locationUrl && (
                                    <a
                                        href={locationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full border transition-opacity hover:opacity-70"
                                        style={{ color: headerColors.accent, borderColor: headerColors.border }}
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                        Map
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                                {inv.status !== 'DRAFT' ? (
                                    <Link
                                        to={`/invite/${slug}/rsvp`}
                                        className="text-sm font-semibold px-6 py-1.5 rounded-full text-white transition-all hover:opacity-90"
                                        style={{ backgroundColor: headerColors.accent }}
                                    >
                                        RSVP
                                    </Link>
                                ) : (
                                    <span
                                        className="text-sm font-semibold px-6 py-1.5 rounded-full text-white opacity-50 cursor-not-allowed"
                                        style={{ backgroundColor: headerColors.accent }}
                                    >
                                        RSVP
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* 2 ── Wedding Details + gallery (single-column full-width) */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="px-8 sm:px-12 pt-8 pb-2"
                    >
                        <SectionTitle title="Wedding Details" headingFont={headingFont} />
                    </motion.div>

                    {galleryImages.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="px-6 sm:px-10 pb-6"
                        >
                            <div className="flex flex-col gap-4">
                                {galleryImages.map((url: string, i: number) => (
                                    <GalleryImage key={i} url={url} />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="px-8 sm:px-12 pb-4">
                            <p className="text-gray-400 text-sm text-center italic">Details images will appear here once uploaded.</p>
                        </div>
                    )}

                    {/* 4 â”€â”€ Event info */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="px-8 sm:px-12 py-6"
                    >
                        <h3
                            className="text-2xl sm:text-3xl font-bold text-gray-800 italic mb-5"
                            style={{ fontFamily: `'${headingFont}', serif` }}
                        >
                            Details
                        </h3>
                        <div className="space-y-4">
                            {inv.eventDate && (
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ backgroundColor: `${primaryColor}18` }}
                                    >
                                        <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">Date &amp; Time</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(inv.eventDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                            {inv.eventTime && ` at ${inv.eventTime}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ backgroundColor: `${primaryColor}18` }}
                                    >
                                        <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">Location</p>
                                        {locationUrl ? (
                                            <a
                                                href={locationUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm hover:underline"
                                                style={{ color: primaryColor }}
                                            >
                                                {location}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500">{location}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {inv.rsvpDeadline && (
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ backgroundColor: `${primaryColor}18` }}
                                    >
                                        <Clock className="w-4 h-4" style={{ color: primaryColor }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">RSVP Deadline</p>
                                        <p className="text-sm text-gray-500">Please RSVP by {formatDate(inv.rsvpDeadline)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* 5 â”€â”€ Q & A */}
                    {faqs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="px-8 sm:px-12 py-6 border-t border-gray-50"
                        >
                            <SectionTitle title="Q &amp; A" headingFont={headingFont} />
                            <p className="text-gray-400 text-sm text-center -mt-3 mb-6">
                                For all our friends and family who have lots of questions, check our Q&amp;A first!
                            </p>
                            <div>
                                {faqs.map((faq) => (
                                    <FaqItem
                                        key={faq.id}
                                        question={faq.question}
                                        answer={faq.answer}
                                        accentColor={primaryColor}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 6 â”€â”€ RSVP CTA */}
                    {inv.status !== 'DRAFT' && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="px-8 sm:px-12 py-8"
                        >
                            <div
                                className="rounded-2xl p-8 text-center"
                                style={{
                                    background: `linear-gradient(135deg, ${primaryColor}12, ${primaryColor}06)`,
                                    border: `1px solid ${primaryColor}22`,
                                }}
                            >
                                <h3
                                    className="text-2xl font-bold text-gray-800 mb-2"
                                    style={{ fontFamily: `'${headingFont}', serif` }}
                                >
                                    Will you join us?
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    We'd love to celebrate this special day with you.
                                </p>
                                <Link
                                    to={`/invite/${slug}/rsvp`}
                                    className="inline-block px-10 py-3 rounded-full text-white font-semibold text-base shadow-lg transition-all hover:scale-105 active:scale-95"
                                    style={{ backgroundColor: primaryColor, boxShadow: `0 6px 24px ${primaryColor}44` }}
                                >
                                    RSVP Now
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* 7 â”€â”€ Footer */}
                    <div className="px-8 sm:px-12 py-6 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-gray-400 text-xs">
                                Powered by{' '}
                                <Link to="/" className="font-semibold hover:underline" style={{ color: primaryColor }}>
                                    InviteFlow
                                </Link>
                            </p>
                            <div className="flex gap-4">
                                <Link to="/" className="text-gray-400 text-xs hover:text-gray-600 transition-colors">Guest Help</Link>
                                <Link to="/" className="text-gray-400 text-xs hover:text-gray-600 transition-colors">About</Link>
                                <Link to="/templates" className="text-gray-400 text-xs hover:text-gray-600 transition-colors">Browse Designs</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

