import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await authApi.register({ name: data.name, email: data.email, password: data.password });
            setUser(res.data.user, res.data.token);
            toast.success('Account created! Welcome to InviteFlow 🎉');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Right: Decorative (shown first on lg to mirror Login) */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#FF6584] via-[#FF8FA3] to-[#6C63FF] items-center justify-center p-12 order-last">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center text-white"
                >
                    <div className="text-8xl mb-6">🎉</div>
                    <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Start creating<br />for free today
                    </h2>
                    <ul className="text-white/80 text-left space-y-2 max-w-xs mx-auto">
                        {['No credit card required', 'Up to 3 beautiful invitations', 'Real-time RSVP tracking', 'Zero ads on your invitations'].map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <span className="text-green-300">✓</span> {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* Left: Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-white">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <Link to="/" className="flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#FF6584]" />
                        <span className="font-bold text-gray-900">InviteFlow</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-gray-500 mb-8">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="text-[#6C63FF] font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="Alex Chen"
                                className="input-base w-full"
                                autoComplete="name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="you@example.com"
                                className="input-base w-full"
                                autoComplete="email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    className="input-base w-full pr-12"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                            <input
                                {...register('confirmPassword')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Repeat your password"
                                className="input-base w-full"
                                autoComplete="new-password"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 text-base">
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Creating account…
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-400">
                            By signing up you agree to our{' '}
                            <a href="#" className="underline hover:text-gray-600">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
