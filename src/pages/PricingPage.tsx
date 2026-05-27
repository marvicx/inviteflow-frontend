import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Crown, Sparkles, ArrowRight } from 'lucide-react';

const tiers = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for trying InviteFlow risk-free.',
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
        description: 'For hosts who want the full experience.',
        color: '#6C63FF',
        features: [
            'Unlimited invitations',
            'Unlimited guests',
            'All 12+ templates',
            'No InviteFlow branding',
            'Bulk email delivery',
            'Export guest list (CSV)',
            'Advanced analytics',
            'QR code check-in',
            'Priority support',
        ],
        cta: 'Coming soon',
        ctaHref: '#',
        highlighted: true,
    },
    {
        name: 'Business',
        price: '$29.99',
        period: 'per month',
        description: 'For agencies & event professionals.',
        color: '#0F0F1A',
        features: [
            'Everything in Pro',
            'Team collaboration (5 seats)',
            'White-label option',
            'API access',
            'Custom template upload',
            'Dedicated account manager',
        ],
        cta: 'Contact sales',
        ctaHref: '#',
        highlighted: false,
    },
];

const comparisons = [
    { feature: 'Invitations', free: '3', pro: 'Unlimited', business: 'Unlimited' },
    { feature: 'Guests per invite', free: '50', pro: 'Unlimited', business: 'Unlimited' },
    { feature: 'Templates', free: '5 free', pro: 'All 12+', business: 'All + custom' },
    { feature: 'Ads on invitations', free: 'None', pro: 'None', business: 'None' },
    { feature: 'Remove InviteFlow branding', free: '—', pro: '✓', business: '✓' },
    { feature: 'QR code check-in', free: '—', pro: '✓', business: '✓' },
    { feature: 'Export guest list (CSV)', free: '—', pro: '✓', business: '✓' },
    { feature: 'API access', free: '—', pro: '—', business: '✓' },
    { feature: 'Team seats', free: '1', pro: '1', business: '5' },
];

export function PricingPage() {
    return (
        <div className="min-h-screen bg-[#F8F7FF]">
            {/* Hero */}
            <div className="section-padding bg-white border-b border-gray-100">
                <div className="container-max text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="badge bg-yellow-100 text-yellow-700 mb-4">
                            <Crown className="w-3 h-3 mr-1" /> Pricing
                        </span>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Simple, transparent <span className="gradient-text">pricing</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Start free forever. Upgrade when you're ready. Zero ads on every plan.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Pricing cards */}
            <div className="section-padding">
                <div className="container-max">
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
                        {tiers.map((tier, i) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
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
                                            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-white' : 'text-[#6C63FF]'}`} />
                                            <span className={`text-sm ${tier.highlighted ? 'text-white/90' : 'text-gray-600'}`}>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Comparison table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Full comparison</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Feature</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Free</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-[#6C63FF]">Pro</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Business</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {comparisons.map((row) => (
                                        <tr key={row.feature} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-700">{row.feature}</td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">{row.free}</td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-[#6C63FF]">{row.pro}</td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">{row.business}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-16"
                    >
                        <p className="text-gray-500 mb-4">Ready to get started?</p>
                        <Link to="/auth/register" className="btn-primary text-lg px-8 py-4 inline-flex">
                            Create your first invitation free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <p className="mt-4 text-sm text-gray-400">No credit card required</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
