import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, Search } from 'lucide-react';

const categories = ['All', 'Wedding', 'Birthday', 'Baby Shower', 'Graduation', 'Corporate', 'Party'];

const templates = [
    { id: '1', name: 'Elegant Floral', category: 'Wedding', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80', premium: false },
    { id: '2', name: 'Modern Minimal', category: 'Wedding', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80', premium: false },
    { id: '3', name: 'Rustic Kraft', category: 'Wedding', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&q=80', premium: true },
    { id: '4', name: 'Confetti Pop', category: 'Birthday', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80', premium: false },
    { id: '5', name: 'Elegant Gold', category: 'Birthday', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', premium: false },
    { id: '6', name: 'Soft Pastel', category: 'Baby Shower', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80', premium: false },
    { id: '7', name: 'Academic Navy', category: 'Graduation', img: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=400&q=80', premium: false },
    { id: '8', name: 'Clean Professional', category: 'Corporate', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', premium: false },
    { id: '9', name: 'Neon Vibes', category: 'Party', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', premium: true },
    { id: '10', name: 'Tropical Paradise', category: 'Party', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', premium: false },
    { id: '11', name: 'Woodland Creatures', category: 'Baby Shower', img: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&q=80', premium: true },
    { id: '12', name: 'Executive Dark', category: 'Corporate', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80', premium: true },
];

export function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = templates.filter((t) => {
        const matchCat = activeCategory === 'All' || t.category === activeCategory;
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="min-h-screen bg-[#F8F7FF]">
            {/* Header */}
            <div className="section-padding bg-white border-b border-gray-100">
                <div className="container-max text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="badge bg-[#FF6584]/10 text-[#FF6584] mb-4">Templates</span>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Designs for <span className="gradient-text">every occasion</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-8">
                            Pick a template and make it yours in minutes.
                        </p>

                        {/* Search bar */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-base pl-12 w-full"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container-max py-12">
                {/* Category tabs */}
                <div className="flex gap-2 flex-wrap mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((t, i) => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group cursor-pointer"
                        >
                            <div className="card overflow-hidden card-hover">
                                <div className="relative h-64">
                                    <img
                                        src={t.img}
                                        alt={t.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    {t.premium && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                                            <Crown className="w-3 h-3" /> PRO
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            to="/auth/register"
                                            className="bg-white text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xl hover:bg-gray-50 transition-colors"
                                        >
                                            Use this template
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-gray-400 mb-1">{t.category}</p>
                                    <p className="font-semibold text-gray-900">{t.name}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-gray-400 py-20">No templates found for "{search}"</p>
                )}
            </div>
        </div>
    );
}
