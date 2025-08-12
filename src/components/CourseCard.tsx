import React from 'react';
import { Calendar, MapPin, Star } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import type { Course } from '../types';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  onAddRound?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onAddRound }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <Card className="flex flex-col space-y-3 hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-base">{course.name}</h3>
          <div className="flex items-center text-stone-500 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            <span>{course.location}</span>
          </div>
        </div>
        {course.rating !== undefined && (
          <div className="flex items-center bg-stone-100 rounded-full px-2 py-1">
            <Star size={14} className="text-amber-400 mr-1" />
            <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      {course.lastPlayed && (
        <div className="flex items-center text-stone-500 text-xs">
          <Calendar size={14} className="mr-1" />
          <span>Last played: {new Date(course.lastPlayed).toLocaleDateString()}</span>
        </div>
      )}
      
      {course.timesPlayed && course.timesPlayed > 0 && (
        <div className="text-stone-500 text-xs">
          Played {course.timesPlayed} {course.timesPlayed === 1 ? 'time' : 'times'}
        </div>
      )}
      
      {onAddRound && (
        <div className="mt-2">
          <Button 
            variant="outline" 
            className="text-xs py-1" 
            onClick={(e) => {
              e.stopPropagation();
              onAddRound();
            }}
          >
            + Add Round
          </Button>
        </div>
      )}
    </Card>
  );
};
