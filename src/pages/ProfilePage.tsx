import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppShell } from '../components/AppShell';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Settings, Camera, Edit2, Trash2 } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth, firestore } from '../lib/firebase';
import { deleteUser } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useToast } from '../hooks/useToast';

const ProfilePage: React.FC = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoProgress, setPhotoProgress] = useState(0);
  
  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [homeCourseName, setHomeCourseName] = useState('');
  const [homeCourseLoc, setHomeCourseLoc] = useState('');
  const [handicap, setHandicap] = useState<string>('');
  
  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setHomeCourseName(userProfile.homeCourseName || '');
      setHomeCourseLoc(userProfile.homeCourseLoc || '');
      setHandicap(userProfile.handicap?.toString() || '');
    }
  }, [userProfile]);
  
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    
    try {
      setUploadingPhoto(true);
      
      // Create a storage reference
      const storageRef = ref(storage, `users/${currentUser.uid}/profile/${Date.now()}_${file.name}`);
      
      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPhotoProgress(progress);
        },
        (error) => {
          console.error('Error uploading photo:', error);
          showToast('Failed to upload profile photo', 'error');
          setUploadingPhoto(false);
        },
        async () => {
          // Upload completed successfully, get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Update the user's profile with the new photo URL
          await updateUserProfile({ photoURL: downloadURL });
          
          showToast('Profile photo updated successfully', 'success');
          setUploadingPhoto(false);
        }
      );
    } catch (error) {
      console.error('Error handling photo change:', error);
      showToast('Failed to update profile photo', 'error');
      setUploadingPhoto(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      await updateUserProfile({
        displayName,
        homeCourseName,
        homeCourseLoc,
        handicap: handicap ? parseFloat(handicap) : undefined,
      });
      
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const confirmed = window.confirm('This will permanently delete your account and all associated data (rounds, courses, photos). This cannot be undone. Continue?');
    if (!confirmed) return;

    try {
      setLoading(true);

      // Delete Firestore subcollections: rounds and coursesPlayed
      const roundsSnap = await getDocs(collection(firestore, `users/${currentUser.uid}/rounds`));
      await Promise.all(roundsSnap.docs.map((d) => deleteDoc(d.ref)));
      const coursesSnap = await getDocs(collection(firestore, `users/${currentUser.uid}/coursesPlayed`));
      await Promise.all(coursesSnap.docs.map((d) => deleteDoc(d.ref)));

      // Delete user doc
      await deleteDoc(doc(firestore, 'users', currentUser.uid));

      // Delete auth user
      await deleteUser(auth.currentUser!);

      showToast('Account deleted', 'info');
    } catch (error) {
      console.error('Delete account error:', error);
      showToast('Failed to delete account. You may need to re-authenticate.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-6 pb-20 sm:pb-6 space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        
        <Card className="flex flex-col md:flex-row items-center p-6 gap-6">
          {/* Profile Photo */}
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-stone-200 flex items-center justify-center">
              {userProfile?.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt={userProfile.displayName || 'Profile'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={40} className="text-stone-400" />
              )}
            </div>
            
            <label 
              htmlFor="photo-upload" 
              className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer border border-stone-200"
            >
              <Camera size={16} className="text-stone-600" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
              />
            </label>
            
            {/* Upload progress indicator */}
            {uploadingPhoto && (
              <div className="mt-2 w-full">
                <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-1 bg-emerald-500" 
                    style={{ width: `${photoProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-stone-500 mt-1 text-center">
                  Uploading... {Math.round(photoProgress)}%
                </p>
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{userProfile?.displayName || 'Golfer'}</h2>
            <p className="text-stone-500">{userProfile?.email}</p>
            
            {userProfile?.totalRounds !== undefined && (
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="text-sm text-stone-500">Rounds</p>
                  <p className="font-semibold">{userProfile.totalRounds}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Courses</p>
                  <p className="font-semibold">{userProfile.totalCourses || 0}</p>
                </div>
                {userProfile.handicap !== undefined && (
                  <div>
                    <p className="text-sm text-stone-500">Handicap</p>
                    <p className="font-semibold">{userProfile.handicap}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center mb-4">
            <Settings size={18} className="mr-2 text-stone-500" />
            <h2 className="text-lg font-semibold">Profile Settings</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              
              {/* Home Course */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Home Course
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={homeCourseName}
                  onChange={(e) => setHomeCourseName(e.target.value)}
                  placeholder="e.g., Pebble Beach Golf Links"
                />
              </div>
              
              {/* Home Course Location */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Home Course Location
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={homeCourseLoc}
                  onChange={(e) => setHomeCourseLoc(e.target.value)}
                  placeholder="e.g., Pebble Beach, CA"
                />
              </div>
              
              {/* Handicap */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Handicap
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                  value={handicap}
                  onChange={(e) => {
                    // Allow only numbers and decimal point
                    const val = e.target.value;
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      setHandicap(val);
                    }
                  }}
                  placeholder="e.g., 12.4"
                />
              </div>
              
              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="flex items-center"
                >
                  <Edit2 size={16} className="mr-1" />
                  Save Profile
                </Button>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-100">
                <div className="text-xs text-stone-500">Danger Zone</div>
                <Button type="button" variant="outline" onClick={handleDeleteAccount} className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 size={16} className="mr-1" /> Delete Account
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
