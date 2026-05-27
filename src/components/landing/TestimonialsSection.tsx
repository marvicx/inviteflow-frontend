import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        name: 'Emily Rodriguez',
        role: 'Bride',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c960?w=80&q=80',
        rating: 5,
        text: 'InviteFlow made our wedding invitations absolutely stunning. The animated reveal when guests opened the invitation had everyone talking. Real-time RSVP tracking saved us so much stress!',
        event: 'Wedding',
    },
    {
        name: 'Marcus Thompson',
        role: 'Event Planner',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
        rating: 5,
        text: 'I\'ve used every invitation platform out there. InviteFlow is the only one with zero ads, real-time updates, and genuinely beautiful designs. My clients love it.',
        event: 'Corporate Events',
    },
    {
        name: 'Priya Patel',
        role: 'Party Host',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
        rating: 5,
        text: 'Set up a birthday party invitation in literally 5 minutes. The template options are gorgeous and customizing with my own photos was so easy. 10/10 would recommend!',
        event: 'Birthday Party',
    },
    {
        name: 'James Liu',
        role: 'HR Manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
        rating: 5,
        text: 'We use InviteFlow for all our company events. The QR code check-in feature is a game-changer for our conferences. Guest list management has never been this smooth.',
        event: 'Company Events',
    },
];

export function TestimonialsSection() {
    const [current, setCurrent] = useState(0);
    const { ref, inView } = useInView();

    const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
    const next = () => setCurrent((c) => (c + 1) % testimonials.length);

    return (
        <section className="section-padding bg-white" ref={ref}>
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="badge bg-yellow-100 text-yellow-700 mb-4">Testimonials</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Hosts <span className="gradient-text">love InviteFlow</span>
                    </h2>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                                className="card p-8 lg:p-10 text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    {[...Array(testimonials[current].rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 italic">
                                    "{testimonials[current].text}"
                                </blockquote>
                                <div className="flex items-center justify-center gap-4">
                                    <img
                                        src={testimonials[current].avatar}
                                        alt={testimonials[current].name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">{testimonials[current].name}</p>
                                        <p className="text-sm text-gray-500">
                                            {testimonials[current].role} · {testimonials[current].event}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex items-center justify-center gap-4 mt-6">
                            <button
                                onClick={prev}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-2">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-[#6C63FF] w-6' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={next}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
