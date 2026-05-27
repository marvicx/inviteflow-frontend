import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center px-4"
            >
                <p className="text-[10rem] font-bold leading-none gradient-text select-none">404</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="btn-primary inline-flex">
                    <Home className="w-4 h-4" /> Back to home
                </Link>
            </motion.div>
        </div>
    );
}
