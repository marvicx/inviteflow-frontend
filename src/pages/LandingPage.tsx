import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import {
    HeroSection,
    StatsSection,
    HowItWorksSection,
    TemplateShowcaseSection,
    FeaturesSection,
    GuestExperienceSection,
    PricingPreviewSection,
    TestimonialsSection,
    FaqSection,
    CtaSection,
} from '@/components/landing';

export function LandingPage() {
    return (
        <div className="overflow-hidden">
            <HeroSection />
            <StatsSection />
            <HowItWorksSection />
            <TemplateShowcaseSection />
            <FeaturesSection />
            <GuestExperienceSection />
            <PricingPreviewSection />
            <TestimonialsSection />
            <FaqSection />
            <CtaSection />
        </div>
    );
}
