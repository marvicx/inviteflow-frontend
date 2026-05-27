import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';
import { usersApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { getInitials } from '@/lib/utils';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().max(200, 'Bio max 200 characters').optional(),
});
type FormData = z.infer<typeof schema>;

export function ProfilePage() {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);
    const [uploading, setUploading] = useState(false);
    const qc = useQueryClient();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: { name: user?.name ?? '', bio: (user as any)?.bio ?? '' },
    });

    const { mutate: saveProfile } = useMutation({
        mutationFn: (data: FormData) => usersApi.updateProfile(data as any),
        onSuccess: (res) => {
            updateUser(res.data.user);
            toast.success('Profile updated!');
        },
        onError: () => toast.error('Failed to update profile'),
    });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadApi.image(file);
            await usersApi.updateProfile({ avatarUrl: res.data.url });
            updateUser({ ...user!, avatarUrl: res.data.url });
            toast.success('Avatar updated!');
        } catch {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Your profile</h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#6C63FF] to-[#FF6584] flex items-center justify-center">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-white">{getInitials(user?.name ?? '')}</span>
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#6C63FF] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-[#5a52e0] transition-colors">
                            {uploading ? (
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                            ) : (
                                <Camera className="w-4 h-4 text-white" />
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                        </label>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit((d) => saveProfile(d))} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Display name</label>
                        <input {...register('name')} className="input-base w-full" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Bio <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            {...register('bio')}
                            rows={3}
                            placeholder="Tell guests a bit about you…"
                            className="input-base w-full resize-none"
                        />
                        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={isSubmitting} className="btn-primary inline-flex">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save profile
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
