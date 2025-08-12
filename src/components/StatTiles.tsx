import React from 'react';
import { Card } from './Card';

interface StatTileProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatTile: React.FC<StatTileProps> = ({ title, value, icon }) => {
  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-stone-500">{title}</span>
        {icon && <span className="text-emerald-500">{icon}</span>}
      </div>
      <div className="font-semibold text-lg">{value}</div>
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
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <StatTile
        title="Total Courses"
        value={totalCourses}
      />
      <StatTile
        title="Total Rounds"
        value={totalRounds}
      />
      <StatTile
        title="Most Played"
        value={mostPlayedCourse}
      />
      <StatTile
        title="Last Played"
        value={lastPlayedDate}
      />
    </div>
  );
};
