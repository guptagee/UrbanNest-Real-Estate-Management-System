import React, { useState } from 'react';
import axios from 'axios';
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
            const response = await axios.post('/api/ai/recommend', { query });
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
        <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 mb-4">
                        <BsStars className="mr-2" />
                        AI-Powered Search
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Describe Your Dream Home
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Just tell us what you're looking for in plain English, and let our AI find the best matches for you.
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-3xl mx-auto mb-16 relative">
                    <form onSubmit={handleSearch} className="relative z-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white rounded-full shadow-xl">
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
                                    <div className="bg-indigo-600 text-white p-3.5 rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center m-1.5">
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
                            <h3 className="text-2xl font-bold text-gray-800">
                                {loading ? 'Searching...' : `Found ${results?.count || 0} Matches`}
                            </h3>
                            {!loading && results?.filters && (
                                <div className="text-sm text-gray-500 hidden sm:block">
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

