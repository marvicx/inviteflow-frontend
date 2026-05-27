import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { Check, Crown, ArrowRight, Sparkles } from 'lucide-react';

const tiers = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for trying out InviteFlow',
        color: '#6B7280',
        features: [
            'Up to 3 invitations',
            'Up to 50 guests per invitation',
            '5 free templates',
            'Basic RSVP tracking',
            'Shareable link',
            'InviteFlow branding',
        ],
        cta: 'Get started free',
        ctaHref: '/auth/register',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$9.99',
        period: 'per month',
        description: 'For hosts who want the full experience',
        color: '#6C63FF',
        features: [
            'Unlimited invitations',
            'Unlimited guests',
            'All 12+ templates',
            'Remove InviteFlow branding',
            'Bulk email delivery',
            'Export guest list (CSV)',
            'Advanced analytics',
            'QR code check-in',
            'Priority support',
        ],
        cta: 'Start Pro — coming soon',
        ctaHref: '#',
        highlighted: true,
    },
    {
        name: 'Business',
        price: '$29.99',
        period: 'per month',
        description: 'For agencies and event professionals',
        color: '#0F0F1A',
        features: [
            'Everything in Pro',
            'Team collaboration',
            'White-label option',
            'API access',
            'Custom template upload',
            'Dedicated account manager',
        ],
        cta: 'Contact sales — coming soon',
        ctaHref: '#',
        highlighted: false,
    },
];

export function PricingPreviewSection() {
    const { ref, inView } = useInView();

    return (
        <section id="pricing" className="section-padding bg-[#F8F7FF]" ref={ref}>
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="badge bg-yellow-100 text-yellow-700 mb-4">
                        <Crown className="w-3 h-3 mr-1" /> Pricing
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Simple, transparent <span className="gradient-text">pricing</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Start free. Upgrade when you're ready. No hidden fees, ever.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1 }}
                            className={`relative rounded-3xl p-8 ${tier.highlighted
                                    ? 'bg-gradient-to-br from-[#6C63FF] to-[#9B6BFF] text-white shadow-2xl shadow-[#6C63FF]/30 scale-105'
                                    : 'bg-white border border-gray-100 shadow-sm'
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                                    <Sparkles className="w-3 h-3" /> Most Popular
                                </div>
                            )}

                            <h3 className={`text-lg font-bold mb-1 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                                {tier.name}
                            </h3>
                            <p className={`text-sm mb-4 ${tier.highlighted ? 'text-white/70' : 'text-gray-500'}`}>
                                {tier.description}
                            </p>

                            <div className="mb-6">
                                <span className={`text-5xl font-bold ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                                    {tier.price}
                                </span>
                                <span className={`text-sm ml-2 ${tier.highlighted ? 'text-white/70' : 'text-gray-500'}`}>
                                    {tier.period}
                                </span>
                            </div>

                            <Link
                                to={tier.ctaHref}
                                className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all mb-8 ${tier.highlighted
                                        ? 'bg-white text-[#6C63FF] hover:bg-white/90'
                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                            >
                                {tier.cta}
                            </Link>

                            <ul className="space-y-3">
                                {tier.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5">
                                        <Check
                                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-white' : 'text-[#6C63FF]'
                                                }`}
                                        />
                                        <span className={`text-sm ${tier.highlighted ? 'text-white/90' : 'text-gray-600'}`}>
                                            {f}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-10 text-sm text-gray-400"
                >
                    Payments not yet implemented. Pro & Business plans coming soon.
                </motion.p>
            </div>
        </section>
    );
}
