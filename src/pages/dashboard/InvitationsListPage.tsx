import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Mail, MoreHorizontal, Eye, Edit, Trash2, Globe, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { invitationsApi } from '@/lib/api';
import { formatDate, getStatusColor, getInviteUrl } from '@/lib/utils';
import { toast } from 'sonner';

export function InvitationsListPage() {
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['invitations'],
        queryFn: () => invitationsApi.list(),
    });

    const invitations = data?.data?.invitations ?? [];

    const { mutate: updateStatus } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            invitationsApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations'] });
        },
        onError: () => toast.error('Failed to update status'),
    });

    const handlePublishToggle = (inv: any) => {
        const newStatus = inv.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        updateStatus({ id: inv.id, status: newStatus });
        toast.success(newStatus === 'PUBLISHED' ? 'Invitation published!' : 'Moved back to draft');
        setMenuOpen(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this invitation? This cannot be undone.')) return;
        try {
            await invitationsApi.delete(id);
            toast.success('Invitation deleted');
            refetch();
        } catch {
            toast.error('Failed to delete invitation');
        }
        setMenuOpen(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Invitations</h1>
                    <p className="text-gray-500 mt-1">{invitations.length} invitation{invitations.length !== 1 ? 's' : ''}</p>
                </div>
                <Link to="/dashboard/invitations/new" className="btn-primary inline-flex">
                    <Plus className="w-4 h-4" /> New invitation
                </Link>
            </div>

            {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-56 bg-gray-100 rounded-2xl shimmer" />
                    ))}
                </div>
            ) : invitations.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="text-6xl mb-4">💌</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No invitations yet</h3>
                    <p className="text-gray-500 mb-6">Create your first beautiful invitation in minutes.</p>
                    <Link to="/dashboard/invitations/new" className="btn-primary inline-flex">
                        <Plus className="w-4 h-4" /> Create invitation
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invitations.map((inv: any, i: number) => (
                        <motion.div
                            key={inv.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="card overflow-hidden group"
                        >
                            {/* Cover */}
                            <div className="relative h-40 bg-gradient-to-br from-[#6C63FF]/20 to-[#FF6584]/20">
                                {inv.coverImageUrl ? (
                                    <img src={inv.coverImageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Mail className="w-12 h-12 text-[#6C63FF]/40" />
                                    </div>
                                )}
                                <span className={`absolute top-3 left-3 badge ${getStatusColor(inv.status)}`}>
                                    {inv.status}
                                </span>

                                {/* Actions menu */}
                                <div className="absolute top-3 right-3">
                                    <button
                                        onClick={() => setMenuOpen(menuOpen === inv.id ? null : inv.id)}
                                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    {menuOpen === inv.id && (
                                        <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10">
                                            <Link
                                                to={`/invite/${inv.slug}`}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setMenuOpen(null)}
                                            >
                                                <Eye className="w-4 h-4" /> Preview
                                            </Link>
                                            <button
                                                onClick={() => handlePublishToggle(inv)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                            >
                                                {inv.status === 'PUBLISHED'
                                                    ? <><EyeOff className="w-4 h-4" /> Unpublish</>
                                                    : <><Globe className="w-4 h-4" /> Publish</>}
                                            </button>
                                            <Link
                                                to={`/dashboard/invitations/${inv.id}/edit`}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setMenuOpen(null)}
                                            >
                                                <Edit className="w-4 h-4" /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(inv.id)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <Link to={`/dashboard/invitations/${inv.id}`} className="block p-4">
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{inv.title}</h3>
                                <p className="text-sm text-gray-400 mb-3">{formatDate(inv.eventDate)}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{inv._count?.guests ?? 0} guests</span>
                                    <span
                                        className="text-xs cursor-pointer hover:underline text-[#6C63FF]"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigator.clipboard.writeText(getInviteUrl(inv.slug));
                                            toast.success('Link copied!');
                                        }}
                                    >
                                        Copy link
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
