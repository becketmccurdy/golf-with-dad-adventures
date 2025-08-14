import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export const trackEvent = (eventName: string, parameters?: AnalyticsParams) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};

// Predefined tracking functions for common events
export const trackPageView = (page_title: string, page_location: string) => {
  trackEvent('page_view', {
    page_title,
    page_location,
  });
};

export const trackUserSignIn = (method: string) => {
  trackEvent('login', {
    method,
  });
};

export const trackUserSignOut = () => {
  trackEvent('sign_out');
};

export const trackRoundAdded = (courseId?: string) => {
  trackEvent('round_added', {
    course_id: courseId,
  });
};

export const trackCourseViewed = (courseId: string, courseName: string) => {
  trackEvent('course_viewed', {
    course_id: courseId,
    course_name: courseName,
  });
};

export const trackPhotoUploaded = () => {
  trackEvent('photo_uploaded');
};

export const trackMapInteraction = (interaction_type: string) => {
  trackEvent('map_interaction', {
    interaction_type,
  });
};
