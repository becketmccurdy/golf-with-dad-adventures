import React from 'react';
import { Card } from './Card';
import { MapPin, Trophy, Calendar, Target } from 'lucide-react';

interface StatTileProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export const StatTile: React.FC<StatTileProps> = ({ title, value, icon, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500 text-emerald-500 bg-emerald-50',
    blue: 'bg-blue-500 text-blue-500 bg-blue-50',
    purple: 'bg-purple-500 text-purple-500 bg-purple-50',
    orange: 'bg-orange-500 text-orange-500 bg-orange-50'
  };
  
  return (
    <Card className="p-4 lg:p-5 hover:scale-105 transition-transform duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${colorClasses[color as keyof typeof colorClasses].split(' ')[2]} flex items-center justify-center flex-shrink-0`}>
          <span className={colorClasses[color as keyof typeof colorClasses].split(' ')[1]}>{icon}</span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xl lg:text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs lg:text-sm font-medium text-stone-600">{title}</div>
      </div>
    </Card>
  );
};

interface StatTilesProps {
  totalCourses: number;
  totalRounds: number;
  mostPlayedCourse?: string;
  lastPlayedDate?: string;
}

export const StatTiles: React.FC<StatTilesProps> = ({
  totalCourses,
  totalRounds,
  mostPlayedCourse = 'None yet',
  lastPlayedDate = 'Never'
}) => {
  const stats = [
    {
      title: 'Courses Played',
      value: totalCourses,
      icon: <MapPin size={20} />,
      color: 'emerald'
    },
    {
      title: 'Total Rounds',
      value: totalRounds,
      icon: <Target size={20} />,
      color: 'blue'
    },
    {
      title: 'Favorite Course',
      value: mostPlayedCourse.length > 15 ? `${mostPlayedCourse.slice(0, 12)}...` : mostPlayedCourse,
      icon: <Trophy size={20} />,
      color: 'purple'
    },
    {
      title: 'Last Round',
      value: lastPlayedDate,
      icon: <Calendar size={20} />,
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <StatTile
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        </div>
      ))}
    </div>
  );
};
