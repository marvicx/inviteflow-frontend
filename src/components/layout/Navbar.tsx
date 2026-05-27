import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';
import { cn, getInitials } from '@/lib/utils';
import { toast } from 'sonner';

interface NavbarProps {
    dashboard?: boolean;
}

export function Navbar({ dashboard = false }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { isAuthenticated, user, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setUserMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch {
            // ignore
        }
        clearAuth();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const navLinks = dashboard
        ? []
        : [
            { label: 'Templates', href: '/templates' },
            { label: 'Features', href: '/#features' },
            { label: 'Pricing', href: '/pricing' },
        ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled || dashboard
                    ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span
                            className="text-xl font-bold"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Invite<span className="text-[#6C63FF]">Flow</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                    location.pathname === link.href
                                        ? 'text-[#6C63FF] bg-[#6C63FF]/10'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {dashboard && (
                            <>
                                <Link to="/dashboard" className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', location.pathname === '/dashboard' ? 'text-[#6C63FF] bg-[#6C63FF]/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}>Overview</Link>
                                <Link to="/dashboard/invitations" className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', location.pathname.includes('/invitations') ? 'text-[#6C63FF] bg-[#6C63FF]/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}>Invitations</Link>
                            </>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen((v) => !v)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center text-white text-xs font-bold">
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} className="w-8 h-8 rounded-full object-cover" alt={user.name} />
                                        ) : (
                                            getInitials(user?.name || 'U')
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                        >
                                            <div className="p-3 border-b border-gray-50">
                                                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            <div className="p-1">
                                                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                </Link>
                                                <Link to="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <User className="w-4 h-4" /> Profile
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                                                    <LogOut className="w-4 h-4" /> Sign out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link to="/auth/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
                                <Link to="/auth/register" className="btn-primary text-sm py-2 px-4">Get started free</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsOpen((v) => !v)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link key={link.href} to={link.href} className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                            {dashboard && (
                                <>
                                    <Link to="/dashboard" className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Overview</Link>
                                    <Link to="/dashboard/invitations" className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Invitations</Link>
                                </>
                            )}
                            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                                {isAuthenticated ? (
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-red-600 font-medium">
                                        <LogOut className="w-4 h-4" /> Sign out
                                    </button>
                                ) : (
                                    <>
                                        <Link to="/auth/login" className="btn-ghost justify-center">Sign in</Link>
                                        <Link to="/auth/register" className="btn-primary justify-center">Get started free</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
