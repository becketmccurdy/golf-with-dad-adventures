import { useState, useMemo, useEffect } from 'react';
import { Flag, MapPin, Calendar, Plus } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './App.css';

// Google Maps configuration
const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 180px)'
};

const center = {
  lat: 37.0902,
  lng: -95.7129
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDbPfW8KvTni70E3O96AXA2quRJJkHIJfQ';

type Course = {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  rating: number;
  datePlayed: string;
  state?: string;
  country: string;
};

type Round = {
  id: string;
  courseId: string;
  date: string;
  score: number;
  par: number;
  rating: number;
  notes?: string;
};

// Sample initial data
const initialCourses: Course[] = [
  {
    id: '1',
    name: 'Pebble Beach Golf Links',
    location: 'Pebble Beach, CA',
    lat: 36.5658,
    lng: -121.9504,
    rating: 4.8,
    datePlayed: '2025-07-15',
    state: 'California',
    country: 'USA'
  },
  {
    id: '2',
    name: 'St. Andrews Links',
    location: 'St. Andrews, Scotland',
    lat: 56.3425,
    lng: -2.8003,
    rating: 4.9,
    datePlayed: '2025-06-22',
    country: 'UK'
  },
  {
    id: '3',
    name: 'Augusta National',
    location: 'Augusta, GA',
    lat: 33.5034,
    lng: -82.0214,
    rating: 4.9,
    datePlayed: '2025-05-30',
    state: 'Georgia',
    country: 'USA'
  }
];

const initialRounds: Round[] = [
  { id: '1', courseId: '1', date: '2025-07-15', score: 82, par: 72, rating: 4.5 },
  { id: '2', courseId: '3', date: '2025-06-22', score: 85, par: 72, rating: 4.8 },
  { id: '3', courseId: '2', date: '2025-05-30', score: 79, par: 72, rating: 4.9 },
];

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'map' | 'schedule'>('dashboard');
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [rounds] = useState<Round[]>(initialRounds);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({ 
    name: '', 
    location: '', 
    lat: 0, 
    lng: 0, 
    rating: 0,
    datePlayed: new Date().toISOString().split('T')[0],
    country: '',
    state: ''
  });
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Calculate statistics
  const totalRounds = rounds.length;
  const averageRating = rounds.length > 0 
    ? (rounds.reduce((sum, round) => sum + round.rating, 0) / rounds.length).toFixed(1)
    : 0;

  // Get most played countries and states
  const locationStats = useMemo(() => {
    const countryCount: Record<string, number> = {};
    const stateCount: Record<string, number> = {};

    rounds.forEach(round => {
      const course = courses.find(c => c.id === round.courseId);
      if (course) {
        countryCount[course.country] = (countryCount[course.country] || 0) + 1;
        if (course.state) {
          stateCount[course.state] = (stateCount[course.state] || 0) + 1;
        }
      }
    });

    const topCountry = Object.entries(countryCount).sort((a, b) => b[1] - a[1])[0];
    const topState = Object.entries(stateCount).sort((a, b) => b[1] - a[1])[0];

    return { topCountry, topState };
  }, [rounds, courses]);

  useEffect(() => {
    if (activeTab === 'map' && mapInstance) {
      window.google.maps.event.trigger(mapInstance, 'resize');
      if (selectedCourse) {
        mapInstance.panTo({ lat: selectedCourse.lat, lng: selectedCourse.lng });
        mapInstance.setZoom(14);
      } else {
        mapInstance.panTo(center);
        mapInstance.setZoom(3);
      }
    }
  }, [activeTab, mapInstance, selectedCourse]);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourseItem: Course = {
      id: Date.now().toString(),
      name: newCourse.name,
      location: newCourse.location,
      lat: parseFloat(newCourse.lat.toString()),
      lng: parseFloat(newCourse.lng.toString()),
      rating: newCourse.rating,
      datePlayed: newCourse.datePlayed,
      country: newCourse.country,
      state: newCourse.state
    };
    setCourses([...courses, newCourseItem]);
    setNewCourse({ 
      name: '', 
      location: '', 
      lat: 0, 
      lng: 0, 
      rating: 0,
      datePlayed: new Date().toISOString().split('T')[0],
      country: '',
      state: ''
    });
    setShowAddCourse(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setCourses(courses.filter(course => course.id !== courseId));
      // If the deleted course is currently selected/edited, clear the selection
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }
      if (editingCourse?.id === courseId) {
        setEditingCourse(null);
      }
    }
  };

  const handleEditCourse = (course: Course) => {
    setNewCourse({
      name: course.name,
      location: course.location,
      lat: course.lat,
      lng: course.lng,
      rating: course.rating,
      datePlayed: course.datePlayed,
      country: course.country,
      state: course.state
    });
    setShowAddCourse(true);
    setEditingCourse(course);
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;

    const updatedCourse: Course = {
      ...editingCourse,
      name: newCourse.name,
      location: newCourse.location,
      lat: parseFloat(newCourse.lat.toString()),
      lng: parseFloat(newCourse.lng.toString()),
      rating: newCourse.rating,
      datePlayed: newCourse.datePlayed,
      country: newCourse.country,
      state: newCourse.state
    };

    setCourses(courses.map(course => 
      course.id === editingCourse.id ? updatedCourse : course
    ));

    if (selectedCourse?.id === editingCourse.id) {
      setSelectedCourse(updatedCourse);
    }

    setEditingCourse(null);
    setShowAddCourse(false);
    setNewCourse({
      name: '',
      location: '',
      lat: 0,
      lng: 0,
      rating: 0,
      datePlayed: new Date().toISOString().split('T')[0],
      country: '',
      state: ''
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <Flag size={32} strokeWidth={2} />
          <h1>Golf With Dad</h1>
        </div>
        <nav className="main-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Flag size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <MapPin size={20} />
            <span>Courses</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={20} />
            <span>Schedule</span>
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{totalRounds}</div>
                <div className="stat-label">Rounds Played</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{averageRating}</div>
                <div className="stat-label">Average Rating</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{locationStats.topCountry ? locationStats.topCountry[0] : 'N/A'}</div>
                <div className="stat-label">Top Country</div>
                {locationStats.topState && (
                  <div className="stat-sublabel">{locationStats.topState[0]}</div>
                )}
              </div>
            </div>

            <div className="dashboard-map" style={{ marginTop: '2rem', width: '100%', height: '400px' }}>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={center}
                  zoom={3}
                  options={options}
                  onLoad={(map) => {
                      setMapInstance(map);
                      setIsMapLoaded(true);
                    }}
                >
                  {courses.map(course => (
                    <Marker
                      key={course.id}
                      position={{ lat: course.lat, lng: course.lng }}
                      title={course.name}
                      onClick={() => setSelectedCourse(course)}
                      icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                          '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" stroke="%23e63946" stroke-width="2"/>' +
                          '<circle cx="12" cy="9" r="3" fill="%23e63946"/>' +
                          '</svg>'
                        )}`,
                        scaledSize: new window.google.maps.Size(24, 24),
                        anchor: new window.google.maps.Point(12, 12)
                      }}
                    >
                      {selectedCourse?.id === course.id && (
                        <InfoWindow position={{ lat: course.lat, lng: course.lng }} onCloseClick={() => setSelectedCourse(null)}>
                          <div>
                            <h3>{course.name}</h3>
                            <p>{course.location}</p>
                            <p>Rating: {course.rating}/5</p>
                            <p>Played: {new Date(course.datePlayed).toLocaleDateString()}</p>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>

            <div className="recent-rounds">
              <h2>Recent Rounds</h2>
              <div className="rounds-list">
                {rounds.map(round => {
                  const course = courses.find(c => c.id === round.courseId);
                  return course ? (
                    <div key={round.id} className="round-item">
                      <div className="round-course">{course.name}</div>
                      <div className="round-details">
                        <span>{round.score} (par {round.par})</span>
                        <span>{new Date(round.date).toLocaleDateString()}</span>
                        <span className="rating">★ {round.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses">
            <div className="courses-header">
              <h2>Golf Courses</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowAddCourse(true)}
              >
                <Plus size={16} /> Add Course
              </button>
            </div>

            {(showAddCourse || editingCourse) && (
              <div className="course-form">
                <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                <div className="form-group">
                  <label>Course Name</label>
                  <input 
                    type="text" 
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    placeholder="e.g. Pebble Beach Golf Links"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={newCourse.location}
                    onChange={(e) => setNewCourse({...newCourse, location: e.target.value})}
                    placeholder="e.g. Pebble Beach, CA"
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input 
                    type="text" 
                    value={newCourse.country}
                    onChange={(e) => setNewCourse({...newCourse, country: e.target.value})}
                    placeholder="e.g. USA"
                  />
                </div>
                <div className="form-group">
                  <label>State/Province (optional)</label>
                  <input 
                    type="text" 
                    value={newCourse.state || ''}
                    onChange={(e) => setNewCourse({...newCourse, state: e.target.value})}
                    placeholder="e.g. California"
                  />
                </div>
                <div className="form-group">
                  <label>Date Played</label>
                  <input
                    type="date"
                    value={newCourse.datePlayed}
                    onChange={(e) => setNewCourse({ ...newCourse, datePlayed: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    step="0.1"
                    value={newCourse.rating}
                    onChange={(e) => setNewCourse({...newCourse, rating: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowAddCourse(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setShowAddCourse(false);
                      setEditingCourse(null);
                      // Reset the form
                      setNewCourse({ 
                        name: '', 
                        location: '', 
                        lat: 0, 
                        lng: 0, 
                        rating: 0, 
                        datePlayed: new Date().toISOString().split('T')[0],
                        country: '',
                        state: ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={editingCourse ? handleUpdateCourse : handleAddCourse}
                    disabled={!newCourse.name || !newCourse.location || !newCourse.country}
                  >
                    {editingCourse ? 'Update Course' : 'Add Course'}
                  </button>
                </div>
              </div>
            )}

            <div className="courses-list">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-info">
                    <h3>{course.name}</h3>
                    <p>{course.location}</p>
                    <div className="course-meta">
                      <span>★ {course.rating.toFixed(1)}</span>
                      <span>Played: {new Date(course.datePlayed).toLocaleDateString()}</span>
                    </div>
                    <div className="course-actions">
                      <button
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourse(course);
                          setActiveTab('map');
                        }}
                        title="View on map"
                      >
                        <MapPin size={16} />
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCourse(course);
                        }}
                        title="Edit course"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        className="btn-icon danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.id);
                        }}
                        title="Delete course"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="map-container">
            <div className="map-header">
              <button 
                className="btn-back"
                onClick={() => setActiveTab('courses')}
              >
                ← Back to Courses
              </button>
              {selectedCourse && (
                <h2>{selectedCourse.name}</h2>
              )}
            </div>
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedCourse ? { lat: selectedCourse.lat, lng: selectedCourse.lng } : center}
                zoom={selectedCourse ? 14 : 3}
                options={options}
                onLoad={(map) => {
                  setMapInstance(map);
                  setIsMapLoaded(true);
                  console.log('Google Maps loaded successfully', map);
                }}
              >
                {isMapLoaded && selectedCourse && (
                  <Marker
                    key={selectedCourse.id}
                    position={{
                      lat: selectedCourse.lat,
                      lng: selectedCourse.lng
                    }}
                    icon={{
                      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                        '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                        '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" stroke="%23e63946" stroke-width="2"/>' +
                        '<circle cx="12" cy="9" r="3" fill="%23e63946"/>' +
                        '</svg>'
                      )}`,
                      scaledSize: new window.google.maps.Size(32, 32),
                      anchor: new window.google.maps.Point(16, 16)
                    }}
                  >
                    <InfoWindow position={{ lat: selectedCourse.lat, lng: selectedCourse.lng }}>
                      <div>
                        <h3>{selectedCourse.name}</h3>
                        <p>{selectedCourse.location}</p>
                        <p>Rating: {selectedCourse.rating}/5</p>
                      </div>
                    </InfoWindow>
                  </Marker>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule">
            <h2>Coming soon: Schedule</h2>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Made with ❤️ for golf adventures with dad</p>
      </footer>
    </div>
  );
}

export default App;
