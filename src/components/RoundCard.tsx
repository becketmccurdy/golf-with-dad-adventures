import React, { useMemo } from 'react';
import { Card } from './Card';
import { Calendar, Star, Flag, Info } from 'lucide-react';
import type { Round } from '../types';
import { useNavigate } from 'react-router-dom';

interface RoundCardProps {
  round: Round;
  showCourse?: boolean;
}

export const RoundCard: React.FC<RoundCardProps> = ({ round, showCourse = true }) => {
  const navigate = useNavigate();
  
  // Format the date properly
  const formattedDate = useMemo(() => {
    try {
      return new Date(round.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return round.date;
    }
  }, [round.date]);
  
  // Calculate score vs par if both are provided
  const scoreVsPar = useMemo(() => {
    if (round.score !== undefined && round.par !== undefined) {
      const diff = round.score - round.par;
      return diff === 0 ? 'E' : diff > 0 ? `+${diff}` : diff.toString();
    }
    return null;
  }, [round.score, round.par]);
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/round/${round.id}`)}
    >
      <div className="flex justify-between">
        <div>
          {showCourse && (
            <h3 className="font-semibold">{round.courseName}</h3>
          )}
          <div className="flex items-center text-stone-500 text-sm mt-1">
            <Calendar size={14} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {/* Score display */}
        {round.score && (
          <div className="flex flex-col items-end">
            <div className="text-lg font-semibold">{round.score}</div>
            {scoreVsPar && (
              <div className={`text-xs font-medium ${
                scoreVsPar === 'E' ? 'text-stone-500' : 
                scoreVsPar.startsWith('+') ? 'text-red-500' : 'text-emerald-500'
              }`}>
                {scoreVsPar}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Additional round details */}
      <div className="mt-3 flex flex-wrap gap-2">
        {round.tees && (
          <span className="inline-flex items-center bg-stone-100 text-xs px-2 py-1 rounded-full">
            <Flag size={12} className="mr-1" />
            {round.tees}
          </span>
        )}
        
        {round.rating && (
          <span className="inline-flex items-center bg-stone-100 text-xs px-2 py-1 rounded-full">
            <Star size={12} className="mr-1" />
            {round.rating}
          </span>
        )}
        
        {round.slope && (
          <span className="inline-flex items-center bg-stone-100 text-xs px-2 py-1 rounded-full">
            <Info size={12} className="mr-1" />
            Slope: {round.slope}
          </span>
        )}
      </div>
      
      {/* Notes preview (if exists) */}
      {round.notes && (
        <div className="mt-2 text-sm text-stone-600 line-clamp-2">
          {round.notes}
        </div>
      )}
      
      {/* Photo indicator (if photos exist) */}
      {round.photoUrls && round.photoUrls.length > 0 && (
        <div className="mt-2 text-xs text-stone-500">
          {round.photoUrls.length} photo{round.photoUrls.length !== 1 ? 's' : ''}
        </div>
      )}
    </Card>
  );
};
