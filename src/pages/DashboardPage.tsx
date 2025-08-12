import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppShell } from '../components/AppShell';
import { Card } from '../components/Card';
import { StatTiles } from '../components/StatTiles';
import { CourseCard } from '../components/CourseCard';
import { MapSection } from '../components/MapSection';
import { Button } from '../components/Button';
import { StatTilesSkeleton, CourseCardSkeleton, MapSectionSkeleton } from '../components/Skeletons';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { courseConverter } from '../types';
import type { Course } from '../types';

const DashboardPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  // Keeping this state for future use but not using it now
  // const [recentRounds, setRecentRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch recent courses played by the user
        const coursesRef = collection(firestore, `users/${currentUser.uid}/coursesPlayed`).withConverter(courseConverter);
        const coursesQuery = query(
          coursesRef,
          orderBy('lastPlayed', 'desc'),
          limit(5)
        );
        
        // Only fetch courses for now - we'll implement rounds in the future
        /*
        const roundsRef = collection(firestore, `users/${currentUser.uid}/rounds`).withConverter(roundConverter);
        const roundsQuery = query(
          roundsRef,
          orderBy('date', 'desc'),
          limit(5)
        );
        */
        
        // Get courses data
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => doc.data());
        
        setRecentCourses(coursesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);
  
  // If we have sample data for demo purposes
  useEffect(() => {
    if (recentCourses.length === 0 && !loading) {
      // Sample course data
      const sampleCourses: Course[] = [
        {
          id: '1',
          name: 'Montcalm',
          location: 'Enfield, NH',
          lat: 43.5615,
          lng: -72.1428,
          state: 'NH',
          country: 'USA',
          timesPlayed: 3,
          lastPlayed: '2025-07-15',
          addedById: currentUser?.uid || '',
          addedOn: '2025-06-01',
          rating: 4.5
        },
        {
          id: '2',
          name: 'Lake Morey',
          location: 'Fairlee, VT',
          lat: 43.9131,
          lng: -72.1564,
          state: 'VT',
          country: 'USA',
          timesPlayed: 2,
          lastPlayed: '2025-07-01',
          addedById: currentUser?.uid || '',
          addedOn: '2025-06-01',
          rating: 4.2
        },
        {
          id: '3',
          name: 'Red Tail',
          location: 'Devens, MA',
          lat: 42.5484,
          lng: -71.5938,
          state: 'MA',
          country: 'USA',
          timesPlayed: 1,
          lastPlayed: '2025-06-20',
          addedById: currentUser?.uid || '',
          addedOn: '2025-06-01',
          rating: 4.7
        },
      ];
      
      setRecentCourses(sampleCourses);
    }
  }, [loading, recentCourses, currentUser]);

  const mostPlayedCourse = recentCourses.length > 0 
    ? recentCourses.reduce((prev, current) => 
        (prev.timesPlayed || 0) > (current.timesPlayed || 0) ? prev : current
      ).name
    : 'None yet';

  const lastPlayedDate = recentCourses.length > 0 && recentCourses[0].lastPlayed
    ? new Date(recentCourses[0].lastPlayed).toLocaleDateString()
    : 'Never';

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-20 sm:pb-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {/* Stats */}
        {loading ? (
          <StatTilesSkeleton />
        ) : (
          <StatTiles
            totalCourses={userProfile?.totalCourses || recentCourses.length}
            totalRounds={userProfile?.totalRounds || 0}
            mostPlayedCourse={mostPlayedCourse}
            lastPlayedDate={lastPlayedDate}
          />
        )}
        
        {/* Map */}
        <div className="mt-6">
          {loading ? (
            <MapSectionSkeleton />
          ) : (
            <MapSection courses={recentCourses} />
          )}
        </div>
        
        {/* Recent courses */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Recent Courses</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/add')}
              className="text-sm"
            >
              <PlusCircle size={16} className="mr-1" />
              Add Round
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <>
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </>
            ) : recentCourses.length > 0 ? (
              recentCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onAddRound={() => navigate(`/add?courseId=${course.id}`)}
                />
              ))
            ) : (
              <Card className="col-span-full p-8 text-center">
                <p className="text-stone-500 mb-4">No rounds yet — log your first one.</p>
                <Button onClick={() => navigate('/add')}>
                  Add Your First Round
                </Button>
              </Card>
            )}
          </div>
          
          {recentCourses.length > 0 && (
            <div className="mt-4 text-center">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/history')}
              >
                View All Courses
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default DashboardPage;
