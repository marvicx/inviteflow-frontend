import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Zap, Shield, Smartphone, Bell, Share2, Download, QrCode, Users } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Real-time RSVP',
        description: 'Watch guests respond live. Your dashboard updates instantly the moment someone RSVPs.',
        color: '#6C63FF',
        bg: '#F0EFFF',
    },
    {
        icon: Smartphone,
        title: 'Mobile First',
        description: 'Guests can RSVP from any device. Every invitation looks stunning on phones and tablets.',
        color: '#FF6584',
        bg: '#FFF0F3',
    },
    {
        icon: QrCode,
        title: 'QR Code Check-in',
        description: 'Generate QR codes for confirmed guests. Perfect for event entry and check-in management.',
        color: '#43B89C',
        bg: '#EDFAF5',
    },
    {
        icon: Bell,
        title: 'Smart Reminders',
        description: 'Automatic email reminders are sent to guests who haven\'t responded before your deadline.',
        color: '#F59E0B',
        bg: '#FFFBEB',
    },
    {
        icon: Shield,
        title: 'No Ads, Ever',
        description: 'Your invitations stay clean and professional. Zero ads, zero clutter — on every plan.',
        color: '#10B981',
        bg: '#ECFDF5',
    },
    {
        icon: Share2,
        title: 'Easy Sharing',
        description: 'Share via link, email, WhatsApp, or social media. Copy a shareable URL in one click.',
        color: '#8B5CF6',
        bg: '#F5F3FF',
    },
    {
        icon: Download,
        title: 'Export Guest List',
        description: 'Export your RSVP data to CSV anytime. Perfect for wedding planners and event coordinators.',
        color: '#EF4444',
        bg: '#FEF2F2',
    },
    {
        icon: Users,
        title: 'Custom Questions',
        description: 'Collect meal preferences, dietary restrictions, song requests — any info you need from guests.',
        color: '#0EA5E9',
        bg: '#F0F9FF',
    },
];

export function FeaturesSection() {
    const { ref, inView } = useInView();

    return (
        <section id="features" className="section-padding bg-[#F8F7FF]" ref={ref}>
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="badge bg-[#43B89C]/10 text-[#43B89C] mb-4">Features</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Everything you need to{' '}
                        <span className="gradient-text">host with confidence</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        We handle the details so you can focus on the celebration.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.07 }}
                            className="card p-6 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: feature.bg }}
                            >
                                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
