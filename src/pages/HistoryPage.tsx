import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppShell } from '../components/AppShell';
import { Card } from '../components/Card';
import { CourseCard } from '../components/CourseCard';
import { MapSection } from '../components/MapSection';
import { RoundCard } from '../components/RoundCard';
import { CourseCardSkeleton } from '../components/Skeletons';
import { List, Calendar, Map, Search, X, ChevronDown } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { courseConverter, roundConverter } from '../types';
import type { Course, Round } from '../types';

type ViewMode = 'list' | 'map';
type FilterYear = string | 'all';

const HistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterYear, setFilterYear] = useState<FilterYear>('all');
  const [filterCourse, setFilterCourse] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [years, setYears] = useState<string[]>([]);
  
  // Fetch data when component mounts
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Get all courses
        const coursesRef = collection(firestore, `users/${currentUser.uid}/coursesPlayed`).withConverter(courseConverter);
        const coursesQuery = query(coursesRef, orderBy('lastPlayed', 'desc'));
        const courseSnapshot = await getDocs(coursesQuery);
        const coursesData = courseSnapshot.docs.map(doc => doc.data());
        setCourses(coursesData);
        
        // Get all rounds
        const roundsRef = collection(firestore, `users/${currentUser.uid}/rounds`).withConverter(roundConverter);
        const roundsQuery = query(roundsRef, orderBy('date', 'desc'));
        const roundSnapshot = await getDocs(roundsQuery);
        const roundsData = roundSnapshot.docs.map(doc => doc.data());
        setRounds(roundsData);
        
        // Extract unique years from rounds
        const uniqueYears = Array.from(
          new Set(
            roundsData.map(round => {
              const date = new Date(round.date);
              return date.getFullYear().toString();
            })
          )
        ).sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending
        
        setYears(uniqueYears);
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);
  
  // For demo purposes, set some sample data if we don't have any
  useEffect(() => {
    if (courses.length === 0 && !loading) {
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
      
      const sampleRounds: Round[] = [
        {
          id: '1',
          userId: currentUser?.uid || '',
          courseId: '1',
          courseName: 'Montcalm',
          date: '2025-07-15',
          score: 82,
          par: 72,
          tees: 'Blue',
          rating: 71.2,
          slope: 132,
          notes: 'Great round, really enjoyed the back 9.',
          createdAt: '2025-07-15',
          updatedAt: '2025-07-15'
        },
        {
          id: '2',
          userId: currentUser?.uid || '',
          courseId: '1',
          courseName: 'Montcalm',
          date: '2025-06-22',
          score: 85,
          par: 72,
          tees: 'Blue',
          rating: 71.2,
          slope: 132,
          notes: 'Windy day, struggled with approach shots.',
          createdAt: '2025-06-22',
          updatedAt: '2025-06-22'
        },
        {
          id: '3',
          userId: currentUser?.uid || '',
          courseId: '2',
          courseName: 'Lake Morey',
          date: '2025-07-01',
          score: 88,
          par: 70,
          tees: 'White',
          rating: 69.8,
          slope: 128,
          notes: 'Beautiful views, played with Dad.',
          createdAt: '2025-07-01',
          updatedAt: '2025-07-01'
        },
      ];
      
      setCourses(sampleCourses);
      setRounds(sampleRounds);
      setYears(['2025']);
    }
  }, [courses.length, loading, currentUser]);
  
  // Apply filters to the list of courses and rounds
  const filteredCourses = courses.filter(course => {
    // Filter by search text
    if (searchText && !course.name.toLowerCase().includes(searchText.toLowerCase()) && 
        !course.location.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const filteredRounds = rounds.filter(round => {
    // Filter by year
    if (filterYear !== 'all') {
      const roundYear = new Date(round.date).getFullYear().toString();
      if (roundYear !== filterYear) return false;
    }
    
    // Filter by course
    if (filterCourse && round.courseId !== filterCourse) return false;
    
    // Filter by search text
    if (searchText && !round.courseName.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Reset filters
  const resetFilters = () => {
    setFilterYear('all');
    setFilterCourse(null);
    setSearchText('');
  };
  
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-6 pb-20 sm:pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">History</h1>
          
          {/* View toggles */}
          <div className="flex bg-stone-100 rounded-lg p-1">
            <button
              className={`px-3 py-1 rounded-md flex items-center ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} className="mr-1" />
              <span className="text-sm">List</span>
            </button>
            <button
              className={`px-3 py-1 rounded-md flex items-center ${viewMode === 'map' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <Map size={16} className="mr-1" />
              <span className="text-sm">Map</span>
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
            
            {/* Year filter */}
            <div className="sm:w-36">
              <div className="relative">
                <select
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3 appearance-none"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value as FilterYear)}
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3 pointer-events-none text-stone-500" />
              </div>
            </div>
            
            {/* Course filter (simplified for this example) */}
            {courses.length > 0 && (
              <div className="sm:w-64">
                <div className="relative">
                  <select
                    className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3 appearance-none"
                    value={filterCourse || ''}
                    onChange={(e) => setFilterCourse(e.target.value || null)}
                  >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 pointer-events-none text-stone-500" />
                </div>
              </div>
            )}
            
            {/* Reset button - only show if filters are applied */}
            {(filterYear !== 'all' || filterCourse !== null || searchText !== '') && (
              <button
                className="flex items-center text-stone-500 hover:text-stone-700 py-2"
                onClick={resetFilters}
              >
                <X size={16} className="mr-1" />
                <span className="text-sm">Reset</span>
              </button>
            )}
          </div>
        </Card>
        
        {/* Content area */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </div>
          ) : viewMode === 'map' ? (
            <>
              <MapSection courses={filteredCourses} />
              <div className="mt-4 text-sm text-center text-stone-500">
                Showing {filteredCourses.length} courses
              </div>
            </>
          ) : (
            <div>
              {/* Courses section */}
              {filteredCourses.length > 0 && !filterCourse && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onAddRound={() => {
                          // Navigate to add round with this course
                          window.location.href = `/add?courseId=${course.id}`;
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Rounds section */}
              {filteredRounds.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Rounds</h2>
                  <div className="space-y-4">
                    {filteredRounds.map(round => (
                      <RoundCard 
                        key={round.id} 
                        round={round} 
                        showCourse={!filterCourse} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* No results */}
              {filteredCourses.length === 0 && filteredRounds.length === 0 && (
                <Card className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Calendar size={32} className="text-stone-300 mb-2" />
                    <p className="text-stone-500 mb-1">No rounds or courses match your filters</p>
                    <button
                      className="text-emerald-500 hover:text-emerald-600 text-sm font-medium mt-2"
                      onClick={resetFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default HistoryPage;
