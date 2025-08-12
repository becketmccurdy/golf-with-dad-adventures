// Type definitions for the app

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  homeCourseName?: string;
  homeCourseLoc?: string;
  handicap?: number;
  totalRounds?: number;
  totalCourses?: number;
  mostPlayedCourseId?: string;
  lastPlayedDate?: string;
}

export interface Course {
  id: string;
  name: string;
  location: string;
  address?: string;
  lat: number;
  lng: number;
  state?: string;
  country: string;
  timesPlayed?: number;
  lastPlayed?: string;
  rating?: number;
  addedById: string;
  addedOn: string;
}

export interface Round {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  date: string;
  score?: number;
  par?: number;
  tees?: string;
  rating?: number;
  slope?: number;
  notes?: string;
  weather?: string;
  playedWith?: string[];
  photoUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

// Firestore Converters
export const userConverter = {
  toFirestore: (user: User) => {
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      homeCourseName: user.homeCourseName,
      homeCourseLoc: user.homeCourseLoc,
      handicap: user.handicap,
      totalRounds: user.totalRounds,
      totalCourses: user.totalCourses,
      mostPlayedCourseId: user.mostPlayedCourseId,
      lastPlayedDate: user.lastPlayedDate,
    };
  },
  fromFirestore: (snapshot: import('firebase/firestore').QueryDocumentSnapshot, options: import('firebase/firestore').SnapshotOptions): User => {
    const data = snapshot.data(options);
    return {
      uid: data.uid,
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      phoneNumber: data.phoneNumber,
      homeCourseName: data.homeCourseName,
      homeCourseLoc: data.homeCourseLoc,
      handicap: data.handicap,
      totalRounds: data.totalRounds,
      totalCourses: data.totalCourses,
      mostPlayedCourseId: data.mostPlayedCourseId,
      lastPlayedDate: data.lastPlayedDate,
    };
  }
};

export const courseConverter = {
  toFirestore: (course: Course) => {
    return {
      id: course.id,
      name: course.name,
      location: course.location,
      address: course.address,
      lat: course.lat,
      lng: course.lng,
      state: course.state,
      country: course.country,
      timesPlayed: course.timesPlayed,
      lastPlayed: course.lastPlayed,
      rating: course.rating,
      addedById: course.addedById,
      addedOn: course.addedOn,
    };
  },
  fromFirestore: (snapshot: import('firebase/firestore').QueryDocumentSnapshot, options: import('firebase/firestore').SnapshotOptions): Course => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      location: data.location,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      state: data.state,
      country: data.country,
      timesPlayed: data.timesPlayed,
      lastPlayed: data.lastPlayed,
      rating: data.rating,
      addedById: data.addedById,
      addedOn: data.addedOn,
    };
  }
};

export const roundConverter = {
  toFirestore: (round: Round) => {
    return {
      userId: round.userId,
      courseId: round.courseId,
      courseName: round.courseName,
      date: round.date,
      score: round.score,
      par: round.par,
      tees: round.tees,
      rating: round.rating,
      slope: round.slope,
      notes: round.notes,
      weather: round.weather,
      playedWith: round.playedWith,
      photoUrls: round.photoUrls,
      createdAt: round.createdAt,
      updatedAt: round.updatedAt,
    };
  },
  fromFirestore: (snapshot: import('firebase/firestore').QueryDocumentSnapshot, options: import('firebase/firestore').SnapshotOptions): Round => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      courseId: data.courseId,
      courseName: data.courseName,
      date: data.date,
      score: data.score,
      par: data.par,
      tees: data.tees,
      rating: data.rating,
      slope: data.slope,
      notes: data.notes,
      weather: data.weather,
      playedWith: data.playedWith,
      photoUrls: data.photoUrls,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
};
