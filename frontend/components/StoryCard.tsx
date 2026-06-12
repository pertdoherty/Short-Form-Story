import React from 'react';
import { StoryIdea } from '../types';
import { Clapperboard, AlignLeft } from 'lucide-react';

interface StoryCardProps {
    story: StoryIdea;
    index: number;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, index }) => {
    // Parse the storyline string into individual shots
    // It expects format like "SHOT 1\nDescription...\n\nSHOT 2\n..."
    const parseShots = (storyline: string) => {
        // Split by "SHOT X" (case insensitive, optional colon)
        const parts = storyline.split(/(?=SHOT\s*\d+:?)/i);
        return parts.filter(part => part.trim() !== '').map(part => {
            // Extract shot number and content
            const match = part.match(/(SHOT\s*\d+:?)\s*([\s\S]*)/i);
            if (match) {
                return { label: match[1].trim(), content: match[2].trim() };
            }
            return { label: 'Scene', content: part.trim() };
        });
    };

    const shots = parseShots(story.storyline);

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg transition-all hover:border-brand-500/50">
            <div className="p-5 border-b border-slate-700 bg-slate-800/50 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-900 text-brand-100 text-xs font-bold">
                            {index + 1}
                        </span>
                        <h3 className="text-xl font-bold text-white">{story.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm flex items-start gap-2">
                        <AlignLeft className="w-4 h-4 mt-0.5 shrink-0" />
                        {story.description}
                    </p>
                </div>
            </div>
            
            <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shots.map((shot, i) => (
                        <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Clapperboard className="w-3 h-3" />
                                {shot.label.replace(':', '')}
                            </h4>
                            <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                                {shot.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};