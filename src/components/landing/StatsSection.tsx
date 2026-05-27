import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView();
    const started = useRef(false);

    useEffect(() => {
        if (inView && !started.current) {
            started.current = true;
            const steps = 60;
            const increment = end / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, (duration * 1000) / steps);
        }
    }, [inView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

const stats = [
    { value: 50000, suffix: '+', label: 'Events Created', color: '#6C63FF' },
    { value: 2000000, suffix: '+', label: 'Invitations Sent', color: '#FF6584' },
    { value: 98, suffix: '%', label: 'Guest Satisfaction', color: '#43B89C' },
    { value: 180, suffix: '+', label: 'Countries Reached', color: '#F59E0B' },
];

export function StatsSection() {
    const { ref, inView } = useInView();

    return (
        <section className="py-16 bg-white" ref={ref}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <p className="text-4xl lg:text-5xl font-bold mb-2" style={{ color: stat.color }}>
                                <CountUp end={stat.value} />
                                {stat.suffix}
                            </p>
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
