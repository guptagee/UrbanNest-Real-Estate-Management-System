import React, { useState } from 'react';
import api from '../utils/api';
import { BsStars, BsSearch } from 'react-icons/bs';
import PropertyCard from './PropertyCard';
import toast from 'react-hot-toast';

const AIRecommendations = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults(null);
        setSearched(true);

        try {
            const response = await api.post('/ai/recommend', { query });
            setResults(response.data);
            if (response.data.count === 0) {
                toast('No properties found matching your criteria, but keep looking!');
            }
        } catch (error) {
            console.error('AI Search Error:', error);
            toast.error('Failed to get recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative py-16 overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="https://cdn.dribbble.com/userupload/16909493/file/original-e6c90943d3d9da57b997c2898244009e.mp4" type="video/mp4" />
                </video>
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/75 to-blue-900/80"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur-sm mb-4 border border-white/30">
                        <BsStars className="mr-2" />
                        AI-Powered Search
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                        Describe Your Dream Home
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
                        Just tell us what you're looking for in plain English, and let our AI find the best matches for you.
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-3xl mx-auto mb-16 relative">
                    <form onSubmit={handleSearch} className="relative z-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white rounded-full shadow-2xl">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g., '3 BHK apartment in Mumbai under 2 Cr with a gym'"
                                    className="flex-1 px-8 py-5 rounded-l-full text-gray-700 focus:outline-none text-lg bg-transparent"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="pr-2"
                                >
                                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3.5 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center m-1.5 shadow-lg">
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <BsSearch className="w-6 h-6" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {searched && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                                {loading ? 'Searching...' : `Found ${results?.count || 0} Matches`}
                            </h3>
                            {!loading && results?.filters && (
                                <div className="text-sm text-white/90 hidden sm:block drop-shadow">
                                    Filters applied: {Object.entries(results.filters)
                                        .filter(([_, v]) => v !== null)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(', ')}
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-lg h-96 animate-pulse">
                                        <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                                        <div className="p-6 space-y-4">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            results?.properties?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {results.properties.map((property) => (
                                        <PropertyCard key={property._id} property={property} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                                        <BsSearch className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No matches found</h3>
                                    <p className="text-gray-500">Try adjusting your search terms or broadening your criteria.</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AIRecommendations;

