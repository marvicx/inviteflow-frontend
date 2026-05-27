import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Home, Share2, Mail, MapPin, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { invitationsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export function RsvpConfirmedPage() {
    const { slug } = useParams<{ slug: string }>();

    const { data } = useQuery({
        queryKey: ['public-invite', slug],
        queryFn: () => invitationsApi.getPublic(slug!),
        enabled: !!slug,
    });

    const inv = data?.data?.invitation;

    useEffect(() => {
        const timer = setTimeout(() => {
            confetti({
                particleCount: 180,
                spread: 80,
                origin: { y: 0.55 },
                colors: ['#6C63FF', '#FF6584', '#43B89C', '#F59E0B', '#a855f7'],
            });
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    const handleShare = () => {
        const url = `${window.location.origin}/invite/${slug}`;
        navigator.share?.({ title: 'Check out this event!', url }).catch(() => {
            navigator.clipboard.writeText(url);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF] px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="max-w-md w-full"
            >
                {/* Card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#6C63FF]/10">
                    {/* Header gradient */}
                    <div className="bg-gradient-to-br from-[#6C63FF] via-[#a855f7] to-[#FF6584] px-8 pt-10 pb-12 text-center relative">
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                            className="text-6xl mb-4"
                        >
                            🎉
                        </motion.div>
                        <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">You're on the list!</h1>
                        <p className="text-white/80 text-sm">Your RSVP has been confirmed</p>
                        {/* Wave bottom */}
                        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                            <svg viewBox="0 0 560 24" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                <path d="M0,24 C140,0 420,48 560,24 L560,24 L0,24 Z" fill="white" />
                            </svg>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-8 pb-8 pt-2">
                        <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
                            A confirmation has been sent to your email with event details and a QR code for entry.
                        </p>

                        {/* Event details */}
                        {inv && (
                            <div className="bg-[#F8F7FF] border border-[#E8E6FF] rounded-2xl p-5 mb-6 space-y-3">
                                <p className="font-bold text-gray-900 text-base">{inv.title}</p>
                                {inv.eventDate && (
                                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-[#6C63FF] shrink-0" />
                                        <span>{formatDate(inv.eventDate)}{inv.eventTime ? ` · ${inv.eventTime}` : ''}</span>
                                    </div>
                                )}
                                {inv.eventLocation && (
                                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-[#FF6584] shrink-0" />
                                        <span>{inv.eventLocation}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Email notice */}
                        <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm text-green-700 font-medium">Confirmation sent to your email</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button onClick={handleShare} className="btn-secondary w-full inline-flex justify-center">
                                <Share2 className="w-4 h-4" /> Share with friends
                            </button>
                            <Link to="/" className="btn-ghost w-full inline-flex justify-center">
                                <Home className="w-4 h-4" /> Back to home
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-gray-400">
                    Powered by{' '}
                    <a href="/" className="text-[#6C63FF] font-semibold hover:underline">InviteFlow</a>
                </p>
            </motion.div>
        </div>
    );
}
