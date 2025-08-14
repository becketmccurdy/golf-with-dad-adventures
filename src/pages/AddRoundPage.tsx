import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppShell } from '../components/AppShell';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../hooks/useToast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Check, Upload, X } from 'lucide-react';
import { collection, addDoc, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../lib/firebase';
import { courseConverter, roundConverter } from '../types';
import type { Course, Round } from '../types';

// Helper to debounce inputs
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const AddRoundPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCourseId = searchParams.get('courseId');

  // Form state
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState<string>('');
  const [par, setPar] = useState<string>('');
  const [tees, setTees] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [slope, setSlope] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [playedWith, setPlayedWith] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  // Photo URLs feature to be implemented later
  // const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // Course search results
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const debouncedSearch = useDebounce(courseSearch, 300);

  // If we have a preselected course, fetch it
  useEffect(() => {
    const fetchCourse = async () => {
      if (preselectedCourseId && currentUser) {
        try {
          setCourseLoading(true);
          const courseRef = doc(
            firestore, 
            `users/${currentUser.uid}/coursesPlayed/${preselectedCourseId}`
          ).withConverter(courseConverter);
          
          const courseSnap = await getDoc(courseRef);
          if (courseSnap.exists()) {
            setSelectedCourse(courseSnap.data());
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          showToast('Error loading course information', 'error');
        } finally {
          setCourseLoading(false);
        }
      }
    };
    
    fetchCourse();
  }, [preselectedCourseId, currentUser, showToast]);

  // Search for courses based on input
  useEffect(() => {
    const searchCourses = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2 || !currentUser) return;
      
      try {
        setCourseLoading(true);
        // Here you would normally query Firestore
        // For demo purposes, we'll just filter a hardcoded list
        const demoCoursesRef = [
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
            addedById: currentUser.uid,
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
            addedById: currentUser.uid,
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
            addedById: currentUser.uid,
            addedOn: '2025-06-01',
            rating: 4.7
          },
        ];
        
        const filtered = demoCoursesRef.filter(course => 
          course.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          course.location.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        
        setSearchResults(filtered);
      } catch (error) {
        console.error("Error searching courses:", error);
      } finally {
        setCourseLoading(false);
      }
    };
    
    searchCourses();
  }, [debouncedSearch, currentUser, showToast]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newPhotos = Array.from(files);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedCourse) {
      showToast('Please select a course', 'warning');
      return;
    }

    try {
      setLoading(true);
      
      // Upload photos first if any
      let photoURLs: string[] = [];
      
      if (photos.length > 0) {
        setUploadingPhotos(true);
        photoURLs = await Promise.all(
          photos.map(async (photo) => {
            const storageRef = ref(storage, `users/${currentUser.uid}/rounds/${Date.now()}_${photo.name}`);
            const uploadTask = uploadBytesResumable(storageRef, photo);
            
            return new Promise<string>((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setUploadProgress(progress);
                },
                (error) => {
                  console.error("Upload failed:", error);
                  reject(error);
                },
                async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(downloadURL);
                }
              );
            });
          })
        );
        setUploadingPhotos(false);
      }
      
      // Create the round document
      const roundsRef = collection(
        firestore, 
        `users/${currentUser.uid}/rounds`
      ).withConverter(roundConverter);
      
      const now = new Date().toISOString();
      
      const roundData: Round = {
        id: '', // Will be set by Firestore
        userId: currentUser.uid,
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        date,
        score: score ? parseInt(score) : undefined,
        par: par ? parseInt(par) : undefined,
        tees,
        rating: rating ? parseFloat(rating) : undefined,
        slope: slope ? parseInt(slope) : undefined,
        notes,
        weather,
        playedWith: playedWith ? playedWith.split(',').map(p => p.trim()) : undefined,
        photoUrls: photoURLs.length > 0 ? photoURLs : undefined,
        createdAt: now,
        updatedAt: now,
      };
      
      await addDoc(roundsRef, roundData);
      
      // Update course info - increment times played and update last played
      const courseRef = doc(firestore, `users/${currentUser.uid}/coursesPlayed/${selectedCourse.id}`);
      await updateDoc(courseRef, {
        timesPlayed: increment(1),
        lastPlayed: date
      });
      
      // Update user profile stats
      const userRef = doc(firestore, `users/${currentUser.uid}`);
      await updateDoc(userRef, {
        totalRounds: increment(1),
        lastPlayedDate: date
      });
      
      showToast('Round added successfully!', 'success');
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Error adding round:", error);
      showToast('Failed to add round', 'error');
    } finally {
      setLoading(false);
      setUploadingPhotos(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-6 pb-20 sm:pb-6 space-y-6">
        <h1 className="text-2xl font-bold">Add Round</h1>
        
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course selection */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Course
              </label>
              
              {selectedCourse ? (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{selectedCourse.name}</div>
                    <div className="text-sm text-stone-500">{selectedCourse.location}</div>
                  </div>
                  <Button 
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => setSelectedCourse(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-stone-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search for a course..."
                      className="pl-10 w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                    />
                  </div>
                  
                  {courseLoading && (
                    <div className="mt-2 text-center">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-emerald-500"></div>
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="mt-2 border rounded-lg divide-y max-h-60 overflow-y-auto" role="listbox" aria-label="Course search results">
                      {searchResults.map(course => (
                        <div 
                          key={course.id}
                          className="p-3 hover:bg-stone-50 cursor-pointer focus:outline-none focus-visible:bg-stone-100"
                          role="option"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedCourse(course);
                            setSearchResults([]);
                            setCourseSearch('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedCourse(course);
                              setSearchResults([]);
                              setCourseSearch('');
                            }
                          }}
                        >
                          <div className="font-medium">{course.name}</div>
                          <div className="text-sm text-stone-500">{course.location}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Date Played
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-stone-400" size={18} />
                <input
                  type="date"
                  className="pl-10 w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            
            {/* Score details - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Your Score
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g., 85"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Course Par
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={par}
                  onChange={(e) => setPar(e.target.value)}
                  placeholder="e.g., 72"
                />
              </div>
            </div>
            
            {/* Tee, Rating, Slope */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Tees Played
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={tees}
                  onChange={(e) => setTees(e.target.value)}
                  placeholder="e.g., Blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Course Rating
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="e.g., 71.2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Slope
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={slope}
                  onChange={(e) => setSlope(e.target.value)}
                  placeholder="e.g., 133"
                />
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Notes
              </label>
              <textarea
                className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did your round go? Any memorable shots or holes?"
                rows={3}
              />
            </div>
            
            {/* Weather */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Weather
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="e.g., Sunny, 75°F, light breeze"
              />
            </div>
            
            {/* Played With */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Played With
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                value={playedWith}
                onChange={(e) => setPlayedWith(e.target.value)}
                placeholder="e.g., Dad, John, Mike (separate with commas)"
              />
            </div>
            
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Photos (Optional)
              </label>
              
              <div className="mt-2">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-stone-300 shadow-sm text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50">
                  <Upload size={16} className="mr-2" />
                  Add Photos
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
              
              {photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="relative h-20 w-20 border rounded overflow-hidden group"
                    >
                      <img 
                        src={URL.createObjectURL(photo)} 
                        alt={`Upload ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {uploadingPhotos && (
                <div className="mt-2">
                  <div className="h-2 bg-stone-200 rounded-full">
                    <div 
                      className="h-2 bg-emerald-500 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-stone-500 mt-1 text-center">
                    Uploading photos... {Math.round(uploadProgress)}%
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={loading}
                disabled={!selectedCourse}
                className="flex items-center"
              >
                <Check size={18} className="mr-1" />
                Save Round
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
};

export default AddRoundPage;
