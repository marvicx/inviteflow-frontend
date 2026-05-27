import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CtaSection() {
    const { ref, inView } = useInView();

    return (
        <section
            className="py-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)' }}
            ref={ref}
        >
            {/* Background orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6C63FF]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF6584]/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#43B89C]/10 rounded-full blur-3xl" />
            </div>

            <div className="container-max relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm border border-white/20"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        Free to start — no credit card required
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Your perfect invitation{' '}
                        <br className="hidden sm:block" />
                        is just{' '}
                        <span className="gradient-text">5 minutes away</span>
                    </h2>

                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
                        Join 50,000+ hosts who've replaced boring email invitations with stunning, animated experiences.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/auth/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                            Start creating for free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link to="/templates" className="btn-ghost text-white border-white/30 hover:bg-white/10 text-lg px-8 py-4 inline-flex items-center">
                            Browse templates
                        </Link>
                    </div>

                    <p className="mt-8 text-white/30 text-sm">
                        No ads · No hidden fees · Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
