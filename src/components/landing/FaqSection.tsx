import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: 'Is InviteFlow really free?',
        a: 'Yes! The Free plan lets you create up to 3 invitations with up to 50 guests each — no credit card required. Upgrade to Pro or Business when you need more.',
    },
    {
        q: 'Will my guests see ads on my invitation?',
        a: 'Never. Unlike competitors like Evite, InviteFlow shows zero ads on invitations — on every plan, including Free.',
    },
    {
        q: 'How do guests RSVP?',
        a: 'You share a unique link (or QR code) with your guests. They click it, see your beautiful invitation, and RSVP in seconds — no account needed.',
    },
    {
        q: 'Can I customize the colors and fonts?',
        a: 'Absolutely. Every template supports custom color palettes and font pairings. On Pro and Business you can upload your own images and fully brand the invitation.',
    },
    {
        q: 'Does it work on mobile?',
        a: 'Yes, InviteFlow is fully responsive. Both the invitation builder and the guest RSVP page look great on phones, tablets, and desktops.',
    },
    {
        q: 'What is the QR code check-in feature?',
        a: 'Once a guest RSVPs "yes", they receive a unique QR code. At your event, scan the code with any phone camera to check them in quickly.',
    },
    {
        q: 'Can I export my guest list?',
        a: 'Pro and Business plans let you export a CSV of your entire guest list including RSVP status, meal preferences, and any custom survey answers.',
    },
    {
        q: 'When will Pro and Business plans launch?',
        a: 'We are currently finalizing payment integration and will announce launch soon. Sign up for a Free account to be notified first.',
    },
];

function FaqItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={onClick}
                className="w-full text-left py-5 flex items-center justify-between gap-4 hover:text-[#6C63FF] transition-colors"
            >
                <span className="font-semibold text-gray-900">{q}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-[#6C63FF] flex-shrink-0" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-gray-500 leading-relaxed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FaqSection() {
    const [open, setOpen] = useState<number | null>(0);
    const { ref, inView } = useInView();

    return (
        <section className="section-padding bg-[#F8F7FF]" ref={ref}>
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="badge bg-[#6C63FF]/10 text-[#6C63FF] mb-4">FAQ</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Questions? <span className="gradient-text">We've got answers.</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 }}
                    className="card max-w-3xl mx-auto p-6 lg:p-8"
                >
                    {faqs.map((faq, i) => (
                        <FaqItem
                            key={i}
                            q={faq.q}
                            a={faq.a}
                            isOpen={open === i}
                            onClick={() => setOpen(open === i ? null : i)}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
