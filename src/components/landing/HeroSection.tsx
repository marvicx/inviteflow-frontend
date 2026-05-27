import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Star } from 'lucide-react';

const floatingCards = [
    { top: '15%', left: '5%', rotate: '-8deg', delay: 0, img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80', label: 'Wedding' },
    { top: '55%', left: '2%', rotate: '6deg', delay: 0.15, img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&q=80', label: 'Birthday' },
    { top: '10%', right: '4%', rotate: '10deg', delay: 0.1, img: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=200&q=80', label: 'Graduation' },
    { top: '60%', right: '3%', rotate: '-5deg', delay: 0.2, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80', label: 'Party' },
];

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F8F7FF] via-white to-[#FFF0F5] pt-16">
            {/* Gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6C63FF]/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FF6584]/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#43B89C]/8 rounded-full blur-3xl" />
            </div>

            {/* Floating invitation cards */}
            {floatingCards.map((card, i) => (
                <motion.div
                    key={i}
                    className="absolute hidden lg:block"
                    style={{ top: card.top, left: (card as any).left, right: (card as any).right }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -12, 0],
                        rotate: [card.rotate, `${parseFloat(card.rotate) + 3}deg`, card.rotate],
                    }}
                    transition={{
                        opacity: { delay: card.delay + 0.5, duration: 0.5 },
                        scale: { delay: card.delay + 0.5, duration: 0.5 },
                        y: { delay: card.delay, duration: 4 + i, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { delay: card.delay, duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
                    }}
                >
                    <div className="w-32 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-2">
                            <p className="text-white text-xs font-semibold text-center">{card.label}</p>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Main content */}
            <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-sm font-medium mb-8"
                >
                    <Sparkles className="w-4 h-4" />
                    The modern way to invite people
                    <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Create Invitations
                    <br />
                    <span className="bg-gradient-to-r from-[#6C63FF] via-[#9B6BFF] to-[#FF6584] bg-clip-text text-transparent">
                        That Wow Your Guests
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Design stunning digital invitations, track RSVPs in real time, and impress your guests with animated reveals — all in one beautiful platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/auth/register" className="btn-primary text-base px-8 py-4 rounded-2xl shadow-xl shadow-[#6C63FF]/25">
                        Start for free <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/templates" className="btn-ghost text-base px-8 py-4">
                        <Play className="w-5 h-5 fill-current" /> Browse templates
                    </Link>
                </motion.div>

                {/* Social proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
                >
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-1 font-medium text-gray-700">4.9/5</span>
                    </div>
                    <span className="hidden sm:block text-gray-300">•</span>
                    <span>Trusted by <strong className="text-gray-700">50,000+</strong> event hosts</span>
                    <span className="hidden sm:block text-gray-300">•</span>
                    <span>No credit card required</span>
                </motion.div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 80L1440 80L1440 40C1440 40 1200 0 720 0C240 0 0 40 0 40L0 80Z" fill="white" />
                </svg>
            </div>
        </section>
    );
}
