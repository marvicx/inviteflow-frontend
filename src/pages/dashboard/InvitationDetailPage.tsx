import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Copy, Users, CheckCircle, XCircle, HelpCircle, Clock,
    ExternalLink, Download, QrCode, Mail, BarChart2, Eye, Send,
    ScanLine, X, Plus, Minus
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { invitationsApi, guestsApi } from '@/lib/api';
import { formatDate, getInviteUrl, getRsvpColor } from '@/lib/utils';
import { toast } from 'sonner';
import { useInvitationSocket } from '@/hooks/useSocket';

export function InvitationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const qrRef = useRef<HTMLCanvasElement>(null);
    const qc = useQueryClient();
    const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
    const [bulkEmails, setBulkEmails] = useState('');
    const [activeTab, setActiveTab] = useState<'guests' | 'analytics'>('guests');

    const { data: invData } = useQuery({
        queryKey: ['invitation', id],
        queryFn: () => invitationsApi.get(id!),
        enabled: !!id,
    });

    const { data: guestData, refetch: refetchGuests } = useQuery({
        queryKey: ['guests', id],
        queryFn: () => guestsApi.list(id!),
        enabled: !!id,
    });

    const { data: analyticsData } = useQuery({
        queryKey: ['analytics', id],
        queryFn: () => invitationsApi.analytics(id!),
        enabled: !!id,
        refetchInterval: 30000,
    });

    // Real-time socket
    useInvitationSocket(id, {
        onNewRsvp: () => { refetchGuests(); qc.invalidateQueries({ queryKey: ['analytics', id] }); toast.info('New RSVP received!'); },
        onUpdatedRsvp: () => { refetchGuests(); qc.invalidateQueries({ queryKey: ['analytics', id] }); },
        onCheckin: () => refetchGuests(),
    });

    const inv = invData?.data?.invitation;
    const guests: any[] = guestData?.data?.guests ?? [];
    const analytics = analyticsData?.data;

    const { mutate: toggleCheckin } = useMutation({
        mutationFn: (guestId: string) => guestsApi.checkin(guestId),
        onSuccess: () => refetchGuests(),
        onError: () => toast.error('Check-in failed'),
    });

    const { mutate: sendBulkInvite, isPending: sendingBulk } = useMutation({
        mutationFn: (emails: string[]) => guestsApi.bulkInvite(id!, emails),
        onSuccess: (res) => {
            toast.success(`Sent to ${res.data.sent} recipients!`);
            setBulkEmailOpen(false);
            setBulkEmails('');
        },
        onError: () => toast.error('Failed to send invitations'),
    });

    const handleDownloadQr = () => {
        const canvas = qrRef.current;
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${inv?.slug ?? 'invitation'}-qr.png`;
        a.click();
        toast.success('QR code downloaded!');
    };

    const handleExportCsv = async () => {
        try {
            const res = await guestsApi.exportCsv(id!);
            const blob = new Blob([res.data], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${inv?.slug ?? 'guests'}-guests.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Guest list exported!');
        } catch {
            toast.error('Export failed');
        }
    };

    const handleBulkSend = () => {
        const emails = bulkEmails
            .split(/[\n,;]+/)
            .map((e) => e.trim())
            .filter((e) => e.includes('@'));
        if (emails.length === 0) { toast.error('Enter at least one valid email'); return; }
        if (emails.length > 100) { toast.error('Maximum 100 emails at once'); return; }
        sendBulkInvite(emails);
    };

    const counts = {
        YES: guests.filter((g) => g.rsvpStatus === 'YES').length,
        NO: guests.filter((g) => g.rsvpStatus === 'NO').length,
        MAYBE: guests.filter((g) => g.rsvpStatus === 'MAYBE').length,
        PENDING: guests.filter((g) => g.rsvpStatus === 'PENDING').length,
    };

    if (!inv) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Bulk email modal */}
            <AnimatePresence>
                {bulkEmailOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setBulkEmailOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 text-lg">Send invitations</h3>
                                <button onClick={() => setBulkEmailOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter email addresses separated by commas, semicolons, or new lines. Up to 100 at once.
                            </p>
                            <textarea
                                value={bulkEmails}
                                onChange={(e) => setBulkEmails(e.target.value)}
                                placeholder={'alice@example.com\nbob@example.com\ncarol@example.com'}
                                rows={5}
                                className="input-base w-full resize-none mb-4"
                            />
                            <div className="flex gap-3">
                                <button onClick={() => setBulkEmailOpen(false)} className="btn-ghost flex-1">Cancel</button>
                                <button onClick={handleBulkSend} disabled={sendingBulk} className="btn-primary flex-1 inline-flex justify-center">
                                    {sendingBulk ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div>
                <Link to="/dashboard/invitations" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to invitations
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{inv.title}</h1>
                        <p className="text-gray-500 mt-1">{formatDate(inv.eventDate)} · {inv.location}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => { navigator.clipboard.writeText(getInviteUrl(inv.slug)); toast.success('Link copied!'); }} className="btn-secondary inline-flex">
                            <Copy className="w-4 h-4" /> Copy link
                        </button>
                        <button onClick={() => setBulkEmailOpen(true)} className="btn-secondary inline-flex">
                            <Mail className="w-4 h-4" /> Send invites
                        </button>
                        <button onClick={handleExportCsv} className="btn-secondary inline-flex">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        <Link to={`/invite/${inv.slug}`} target="_blank" className="btn-ghost inline-flex">
                            <ExternalLink className="w-4 h-4" /> Preview
                        </Link>
                        <Link to={`/dashboard/invitations/${inv.id}/edit`} className="btn-primary inline-flex">
                            Edit
                        </Link>
                    </div>
                </div>
            </div>

            {/* RSVP Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Attending', count: counts.YES, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Declined', count: counts.NO, icon: XCircle, color: '#EF4444', bg: '#FEF2F2' },
                    { label: 'Maybe', count: counts.MAYBE, icon: HelpCircle, color: '#F59E0B', bg: '#FFFBEB' },
                    { label: 'Pending', count: counts.PENDING, icon: Clock, color: '#6B7280', bg: '#F9FAFB' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="card p-6"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: stat.bg }}>
                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* QR Code + Tabbed Panel */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* QR Code */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 flex flex-col items-center text-center"
                >
                    <div className="flex items-center gap-2 mb-4 self-start">
                        <QrCode className="w-5 h-5 text-[#6C63FF]" />
                        <h2 className="text-lg font-bold text-gray-900">QR Code</h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-5">Share or print this QR code. Guests scan it to open your invitation directly.</p>
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
                        <QRCodeCanvas
                            ref={qrRef}
                            value={getInviteUrl(inv.slug)}
                            size={160}
                            bgColor="#ffffff"
                            fgColor="#1a1a2e"
                            level="M"
                            imageSettings={{
                                src: '/favicon.ico',
                                height: 24,
                                width: 24,
                                excavate: true,
                            }}
                        />
                    </div>
                    <button onClick={handleDownloadQr} className="btn-secondary inline-flex w-full justify-center">
                        <Download className="w-4 h-4" /> Download PNG
                    </button>
                    {inv.maxGuests && (
                        <div className="mt-4 w-full">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Capacity</span>
                                <span>{counts.YES} / {inv.maxGuests}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(100, (counts.YES / inv.maxGuests) * 100)}%`,
                                        backgroundColor: counts.YES >= inv.maxGuests ? '#EF4444' : '#6C63FF',
                                    }}
                                />
                            </div>
                            {counts.YES >= inv.maxGuests && (
                                <p className="text-xs text-red-500 mt-1 font-medium">Event is at capacity</p>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Guests / Analytics tabs */}
                <div className="card p-6 lg:col-span-2 flex flex-col">
                    {/* Tab bar */}
                    <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl self-start">
                        <button
                            onClick={() => setActiveTab('guests')}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'guests'
                                    ? 'bg-white text-[#6C63FF] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Users className="w-4 h-4" /> Guests
                            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-[#6C63FF]/10 text-[#6C63FF]">{guests.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'analytics'
                                    ? 'bg-white text-[#6C63FF] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <BarChart2 className="w-4 h-4" /> Analytics
                        </button>
                    </div>

                    {/* Guests tab */}
                    {activeTab === 'guests' && (
                        guests.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-10">
                                <div className="text-4xl mb-3">👥</div>
                                <p className="text-gray-500">No RSVPs yet. Share your invitation to get started!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                            <th className="pb-3 pr-4">Name</th>
                                            <th className="pb-3 pr-4">Email</th>
                                            <th className="pb-3 pr-4">Status</th>
                                            <th className="pb-3 pr-4">+1s</th>
                                            <th className="pb-3 text-right">Check-in</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {guests.map((g: any) => (
                                            <tr key={g.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 pr-4 font-medium text-gray-900">{g.name}</td>
                                                <td className="py-3 pr-4 text-gray-500 text-sm truncate max-w-[140px]">{g.email}</td>
                                                <td className="py-3 pr-4">
                                                    <span className={`badge ${getRsvpColor(g.rsvpStatus)}`}>{g.rsvpStatus}</span>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-500 text-sm">{g.plusOnes ?? 0}</td>
                                                <td className="py-3 text-right">
                                                    <button
                                                        onClick={() => toggleCheckin(g.id)}
                                                        title={g.checkedIn ? 'Mark as not checked in' : 'Mark as checked in'}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${g.checkedIn
                                                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <ScanLine className="w-3.5 h-3.5" />
                                                        {g.checkedIn ? 'In' : '—'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}

                    {/* Analytics tab */}
                    {activeTab === 'analytics' && (
                        <div className="flex-1">
                            {!analytics ? (
                                <div className="flex items-center justify-center h-40">
                                    <div className="w-6 h-6 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Page views', value: analytics.viewCount ?? 0, icon: Eye, color: '#6C63FF', bg: '#F0EFFE' },
                                        { label: 'Response rate', value: `${analytics.responseRate ?? 0}%`, icon: BarChart2, color: '#10B981', bg: '#ECFDF5' },
                                        { label: 'Checked in', value: analytics.checkedIn ?? 0, icon: ScanLine, color: '#F59E0B', bg: '#FFFBEB' },
                                        { label: 'Attending', value: analytics.attending ?? 0, icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
                                                <item.icon className="w-4 h-4" style={{ color: item.color }} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                                <p className="text-xs text-gray-500">{item.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {analytics.capacity && (
                                        <div className="col-span-2 rounded-2xl border border-gray-100 p-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium text-gray-700">Capacity used</span>
                                                <span className="text-gray-500">{analytics.capacityUsed} / {analytics.capacity}</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${Math.min(100, ((analytics.capacityUsed ?? 0) / analytics.capacity) * 100)}%`,
                                                        backgroundColor: (analytics.capacityUsed ?? 0) >= analytics.capacity ? '#EF4444' : '#6C63FF',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-span-2 rounded-2xl border border-gray-100 p-4">
                                        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">RSVP breakdown</p>
                                        <div className="flex gap-4 flex-wrap">
                                            {[
                                                { label: 'Attending', val: analytics.attending ?? 0, color: '#10B981' },
                                                { label: 'Declined', val: analytics.declined ?? 0, color: '#EF4444' },
                                                { label: 'Maybe', val: analytics.maybe ?? 0, color: '#F59E0B' },
                                                { label: 'Pending', val: analytics.pending ?? 0, color: '#6B7280' },
                                            ].map((r) => (
                                                <div key={r.label} className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                                                    <span className="text-sm text-gray-600">{r.label}: <strong>{r.val}</strong></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
