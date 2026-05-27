import { useRef } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const templates = [
    { name: 'Elegant Floral', category: 'Wedding', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80', premium: false, color: '#C9A96E' },
    { name: 'Confetti Pop', category: 'Birthday', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80', premium: false, color: '#FF6584' },
    { name: 'Academic Navy', category: 'Graduation', img: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=400&q=80', premium: false, color: '#1B2A4A' },
    { name: 'Soft Pastel', category: 'Baby Shower', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80', premium: false, color: '#FFB3C6' },
    { name: 'Neon Vibes', category: 'Party', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', premium: true, color: '#FF00FF' },
    { name: 'Clean Professional', category: 'Corporate', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', premium: false, color: '#2563EB' },
    { name: 'Tropical Paradise', category: 'Party', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', premium: false, color: '#43B89C' },
    { name: 'Executive Dark', category: 'Corporate', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80', premium: true, color: '#C9A96E' },
];

export function TemplateShowcaseSection() {
    const autoplay = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 }, [autoplay.current]);
    const { ref, inView } = useInView();

    return (
        <section className="py-20 bg-white overflow-hidden" ref={ref}>
            <div className="container-max px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-12"
                >
                    <span className="badge bg-[#FF6584]/10 text-[#FF6584] mb-4">Templates</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Beautiful designs for{' '}
                        <span className="gradient-text">every occasion</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        12+ professionally crafted templates — weddings, birthdays, corporate events, and more.
                    </p>
                </motion.div>
            </div>

            {/* Full-width carousel */}
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex gap-5 px-8">
                    {[...templates, ...templates].map((t, i) => (
                        <div key={i} className="flex-none w-60 sm:w-72">
                            <div className="card-hover group cursor-pointer">
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={t.img}
                                        alt={t.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    {t.premium && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                                            <Crown className="w-3 h-3" /> PRO
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <span className="text-white/70 text-xs">{t.category}</span>
                                        <p className="text-white font-semibold">{t.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="text-center mt-10"
            >
                <Link to="/templates" className="btn-secondary inline-flex">
                    See all templates <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </section>
    );
}
