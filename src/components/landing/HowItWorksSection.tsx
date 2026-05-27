import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Palette, Send, BarChart3 } from 'lucide-react';

const steps = [
    {
        icon: Palette,
        step: '01',
        title: 'Pick & Customize',
        description: 'Choose from 12+ stunning templates. Add your photos, change colors, fonts, and make it uniquely yours in minutes.',
        color: '#6C63FF',
        bg: '#F0EFFF',
    },
    {
        icon: Send,
        step: '02',
        title: 'Share Instantly',
        description: 'Send your invitation via a shareable link, email, WhatsApp, or social media. Your guests can view it on any device.',
        color: '#FF6584',
        bg: '#FFF0F3',
    },
    {
        icon: BarChart3,
        step: '03',
        title: 'Track in Real Time',
        description: 'Watch RSVPs roll in live. See who\'s coming, manage your guest list, and send reminders — all from your dashboard.',
        color: '#43B89C',
        bg: '#EDFAF5',
    },
];

export function HowItWorksSection() {
    const { ref, inView } = useInView();

    return (
        <section id="how-it-works" className="section-padding bg-[#F8F7FF]" ref={ref}>
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="badge bg-[#6C63FF]/10 text-[#6C63FF] mb-4">How it works</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Three steps to your{' '}
                        <span className="gradient-text">perfect invitation</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        From idea to inbox in under 5 minutes. No design skills required.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting line */}
                    <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#6C63FF] via-[#FF6584] to-[#43B89C] opacity-20" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.15 }}
                            className="relative"
                        >
                            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
                                <div className="relative inline-flex mb-6">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: step.bg }}
                                    >
                                        <step.icon className="w-8 h-8" style={{ color: step.color }} />
                                    </div>
                                    <span
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md"
                                        style={{ backgroundColor: step.color }}
                                    >
                                        {step.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
