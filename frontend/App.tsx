import React, { useState, useCallback } from 'react';
import { GenerationParams, StoryIdea } from './types';
import { generateStories } from './services/geminiService';
import { StoryCard } from './components/StoryCard';
import { Sparkles, Download, Loader2, FileVideo, Settings2 } from 'lucide-react';

const App: React.FC = () => {
    const [params, setParams] = useState<GenerationParams>({
        projectName: '',
        concept: '',
        tone: '',
        quantity: 3,
    });
    const [stories, setStories] = useState<StoryIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({
            ...prev,
            [name]: name === 'quantity' ? parseInt(value, 10) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!params.concept.trim()) {
            setError("Please provide a core concept.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const generatedStories = await generateStories(params);
            setStories(generatedStories);
        } catch (err: any) {
            setError(err.message || "An error occurred while generating stories.");
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = useCallback(() => {
        if (stories.length === 0) return;

        const headers = ['No.', 'Title', 'Description', 'Full Storyline'];
        const rows = stories.map((story, index) => [
            (index + 1).toString(),
            `"${story.title.replace(/"/g, '""')}"`,
            `"${story.description.replace(/"/g, '""')}"`,
            `"${story.storyline.replace(/"/g, '""')}"`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        
        const fileName = params.projectName ? `${params.projectName.replace(/\s+/g, '_')}_stories.csv` : 'generated_stories.csv';
        link.setAttribute('download', fileName);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [stories, params.projectName]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Sidebar - Configuration */}
            <div className="w-full md:w-96 bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-auto md:h-screen sticky top-0 overflow-y-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-brand-500 p-2 rounded-lg">
                        <FileVideo className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white leading-tight">Short-Form</h1>
                        <h2 className="text-sm text-brand-400 font-medium">Story Generator</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-grow">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            value={params.projectName}
                            onChange={handleInputChange}
                            placeholder="e.g., Office Humor Season 1"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="concept" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Core Concept / Theme <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            id="concept"
                            name="concept"
                            value={params.concept}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            placeholder="e.g., A cat secretly plotting world domination but getting distracted by a red dot"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Tone / Style
                        </label>
                        <input
                            type="text"
                            id="tone"
                            name="tone"
                            value={params.tone}
                            onChange={handleInputChange}
                            placeholder="e.g., Sarcastic, fast-paced, Gen-Z"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Number of Ideas
                        </label>
                        <select
                            id="quantity"
                            name="quantity"
                            value={params.quantity}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none"
                        >
                            <option value={1}>1 Idea</option>
                            <option value={3}>3 Ideas</option>
                            <option value={5}>5 Ideas</option>
                            <option value={10}>10 Ideas</option>
                        </select>
                    </div>

                    <div className="mt-auto pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Scripts
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Main Area - Results */}
            <div className="flex-1 bg-slate-950 p-6 md:p-10 overflow-y-auto h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Settings2 className="w-6 h-6 text-slate-400" />
                            Generated Output
                        </h2>
                        
                        {stories.length > 0 && (
                            <button
                                onClick={exportToCSV}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {stories.length === 0 && !isLoading && !error && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                            <p>Fill out the form and click generate to see ideas here.</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-6">
                        {stories.map((story, index) => (
                            <StoryCard key={index} story={story} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;