import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { CheckCircle2, Clock, Users, MessageSquare } from 'lucide-react';

export function GuestExperienceSection() {
    const { ref, inView } = useInView();

    const hostFeatures = [
        'Real-time RSVP notifications',
        'Guest list management dashboard',
        'Send updates to all guests',
        'Export guest data to CSV',
        'Track open & response rates',
    ];

    const guestFeatures = [
        'Animated invitation reveal',
        'One-click RSVP from any device',
        'Countdown timer to the event',
        'Add event to calendar',
        'Share with friends & family',
    ];

    return (
        <section className="section-padding bg-white" ref={ref}>
            <div className="container-max">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="badge bg-[#6C63FF]/10 text-[#6C63FF] mb-4">Two-sided experience</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Perfect for <span className="gradient-text">hosts & guests</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Host side */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="rounded-3xl bg-gradient-to-br from-[#6C63FF] to-[#9B6BFF] p-8 text-white mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold">For Hosts</h3>
                            </div>

                            {/* Mock dashboard */}
                            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium">RSVP Summary</span>
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Live
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Coming', count: 42, color: 'bg-green-400' },
                                        { label: 'Declined', count: 8, color: 'bg-red-400' },
                                        { label: 'Pending', count: 15, color: 'bg-yellow-400' },
                                    ].map((item) => (
                                        <div key={item.label} className="text-center">
                                            <div className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-1`} />
                                            <p className="text-2xl font-bold">{item.count}</p>
                                            <p className="text-xs text-white/70">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {['Alex Chen RSVP\'d Yes ✓', 'Sara Kim RSVP\'d Maybe', 'New guest joined!'].map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.5 + i * 0.15 }}
                                        className="flex items-center gap-2 bg-white/10 rounded-xl p-3"
                                    >
                                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">{msg}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <ul className="space-y-3">
                            {hostFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-3 text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 text-[#6C63FF] flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Guest side */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="rounded-3xl bg-gradient-to-br from-[#FF6584] to-[#FF8FA3] p-8 text-white mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold">For Guests</h3>
                            </div>

                            {/* Mock invitation */}
                            <div className="bg-white rounded-2xl p-6 text-gray-900 shadow-xl">
                                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">You're invited to</p>
                                <h4 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Sarah & James
                                </h4>
                                <p className="text-gray-500 text-sm mb-4">Wedding Celebration</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                                    <span>📅 June 14, 2026</span>
                                    <span>📍 Grand Ballroom</span>
                                </div>

                                {/* Countdown */}
                                <div className="flex gap-3 mb-5">
                                    {[{ v: '26', l: 'Days' }, { v: '14', l: 'Hrs' }, { v: '32', l: 'Min' }].map((t) => (
                                        <div key={t.l} className="flex-1 text-center bg-gray-50 rounded-xl p-2">
                                            <p className="text-xl font-bold text-[#FF6584]">{t.v}</p>
                                            <p className="text-xs text-gray-400">{t.l}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 rounded-xl bg-[#6C63FF] text-white text-sm font-semibold">
                                        Accept ✓
                                    </button>
                                    <button className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-3">
                            {guestFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-3 text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 text-[#FF6584] flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
