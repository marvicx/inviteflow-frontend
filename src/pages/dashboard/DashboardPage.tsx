import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Mail, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { invitationsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { getStatusColor, formatDate } from '@/lib/utils';

export function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const { data, isLoading } = useQuery({
        queryKey: ['invitations'],
        queryFn: () => invitationsApi.list(),
    });

    const invitations = data?.data?.invitations ?? [];
    const totalGuests = invitations.reduce((sum: number, inv: any) => sum + (inv._count?.guests ?? 0), 0);
    const published = invitations.filter((i: any) => i.status === 'PUBLISHED').length;
    const recent = invitations.slice(0, 5);

    const stats = [
        { label: 'Total Invitations', value: invitations.length, icon: Mail, color: '#6C63FF', bg: '#F0EFFF' },
        { label: 'Total Guests', value: totalGuests, icon: Users, color: '#FF6584', bg: '#FFF0F3' },
        { label: 'Published', value: published, icon: CheckCircle, color: '#43B89C', bg: '#EDFAF5' },
        { label: 'Drafts', value: invitations.length - published, icon: Clock, color: '#F59E0B', bg: '#FFFBEB' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your events.</p>
                </div>
                <Link to="/dashboard/invitations/new" className="btn-primary inline-flex self-start sm:self-auto">
                    <Plus className="w-4 h-4" /> New invitation
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="card p-6"
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                            style={{ backgroundColor: stat.bg }}
                        >
                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent invitations */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Recent invitations</h2>
                    <Link to="/dashboard/invitations" className="text-sm text-[#6C63FF] hover:underline flex items-center gap-1">
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl shimmer" />
                        ))}
                    </div>
                ) : recent.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">💌</div>
                        <p className="text-gray-500 mb-4">No invitations yet.</p>
                        <Link to="/dashboard/invitations/new" className="btn-primary inline-flex">
                            <Plus className="w-4 h-4" /> Create your first invitation
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recent.map((inv: any) => (
                            <Link
                                key={inv.id}
                                to={`/dashboard/invitations/${inv.id}`}
                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#F0EFFF] flex-shrink-0 overflow-hidden">
                                    {inv.coverImageUrl ? (
                                        <img src={inv.coverImageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Mail className="w-5 h-5 text-[#6C63FF] m-2.5" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{inv.title}</p>
                                    <p className="text-sm text-gray-400">{formatDate(inv.eventDate)} · {inv._count?.guests ?? 0} guests</p>
                                </div>
                                <span className={`badge ${getStatusColor(inv.status)}`}>{inv.status}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
