import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, CheckCircle2, AlertCircle, Loader2, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshUser } = useAuth();

  const [username, setUsername] = useState(user?.username || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profile_image || null);
  const [loading, setLoading] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal is opened
  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username || '');
      setSelectedFile(null);
      setPreviewUrl(user.profile_image || null);
      setShowDeleteConfirm(false);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const hasProfileImage = Boolean(user.profile_image);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setErrorMessage(null);
      setShowDeleteConfirm(false);
    }
  };

  /**
   * Delete existing profile picture using DELETE /api/users/me/profile-image
   */
  const handleDeleteProfileImage = async () => {
    if (isDeletingImage) return;

    setIsDeletingImage(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Send DELETE request to documented endpoint
      await authService.removeProfileImage();

      // Immediately reset local preview and file state
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowDeleteConfirm(false);

      // Re-fetch authenticated user profile from backend so change persists across sessions
      await refreshUser();
      setSuccessMessage('Profile picture removed successfully.');
    } catch (err: any) {
      console.error('Failed to remove profile image:', err);

      // Gracefully handle case where backend already marked image as removed
      if (
        err.statusCode === 400 &&
        (err.message?.includes('already removed') || err.message?.includes('not found'))
      ) {
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setShowDeleteConfirm(false);
        await refreshUser();
        setSuccessMessage('Profile picture removed successfully.');
      } else {
        setErrorMessage(
          err.message || 'Unable to remove profile picture. Please try again.'
        );
      }
    } finally {
      setIsDeletingImage(false);
    }
  };

  /**
   * Save profile updates (username and/or new profile image)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isUsernameChanged = username.trim() !== user.username;
    const isImageChanged = selectedFile !== null;

    if (!isUsernameChanged && !isImageChanged) {
      setErrorMessage('No changes were made to your profile.');
      return;
    }

    if (isUsernameChanged && !username.trim()) {
      setErrorMessage('Username cannot be empty.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. If username was modified, send PATCH /api/users/me without requiring password
      if (isUsernameChanged) {
        try {
          await authService.updateProfile({
            username: username.trim(),
          });
        } catch (updateErr: any) {
          console.error('Update profile username error:', updateErr);
          if (
            updateErr.statusCode === 500 ||
            updateErr.message?.includes('500') ||
            updateErr.message?.includes('Internal server error')
          ) {
            throw new Error(
              'Backend API Limitation: The server endpoint (PATCH /api/users/me) currently requires a password in its schema (updateTDO). To allow updating username without a password, the backend must make the password field optional.'
            );
          }
          throw updateErr;
        }
      }

      // 2. If a new profile image was selected, upload via POST /api/users/me/upload_image
      if (isImageChanged && selectedFile) {
        try {
          await authService.uploadProfileImage(selectedFile);
        } catch (uploadErr: any) {
          console.warn('Profile image upload error:', uploadErr);
          if (
            uploadErr.statusCode === 500 ||
            uploadErr.message?.includes('500') ||
            uploadErr.message?.includes('Internal server error')
          ) {
            throw new Error(
              'Backend Storage Limitation: The server (POST /api/users/me/upload_image) returned 500 because Vercel serverless has a read-only filesystem for local file uploads. Cloud storage (e.g. Cloudinary/S3) is required on the backend.'
            );
          }
          throw uploadErr;
        }
      }

      // Refresh live user profile in context and show success
      await refreshUser();
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Save changes error:', err);
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FAF6F2] rounded-3xl border border-[#DFD4C8] shadow-2xl p-5 sm:p-8 space-y-6 text-[#111111] relative max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE0D5] pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111111]">
              Edit Profile
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Update your account details and profile picture
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EEE9E5] text-[#555555] hover:text-[#111111] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section: Display, Upload, and Delete Actions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-5">
              {/* Avatar Circle */}
              <div className="relative w-20 h-20 rounded-full bg-[#EEE9E5] border-2 border-[#C49B82]/60 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-[#C49B82]" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDeletingImage || loading}
                    className="px-3.5 py-2 rounded-lg bg-[#EEE9E5] hover:bg-[#E5D7CA] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#C49B82]" />
                    {hasProfileImage || selectedFile ? 'Change Picture' : 'Choose Picture'}
                  </button>

                  {/* Remove Profile Picture Button — Only shown when user has a saved profile picture */}
                  {hasProfileImage && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeletingImage || loading}
                      className="px-3.5 py-2 rounded-lg bg-transparent hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      Remove Picture
                    </button>
                  )}

                  {/* Revert uncommitted file selection */}
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(user.profile_image || null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-3 py-2 rounded-lg bg-transparent text-[#666666] hover:text-[#111111] text-xs font-semibold uppercase transition"
                    >
                      Cancel Selection
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-[#777777]">
                  PNG, JPG or WebP up to 5MB
                </p>
              </div>
            </div>

            {/* In-place Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-xs text-red-900 space-y-2.5 animate-in fade-in duration-150">
                <div className="font-semibold text-red-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Are you sure you want to remove your profile picture?</span>
                </div>
                <p className="text-[11px] text-red-700 leading-relaxed">
                  This will delete your picture from your profile and reset to the default avatar.
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    disabled={isDeletingImage}
                    onClick={handleDeleteProfileImage}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-50 shadow-xs"
                  >
                    {isDeletingImage ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3" />
                        <span>Yes, Remove</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isDeletingImage}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-red-200 text-[#555555] hover:text-[#111111] font-semibold text-[11px] uppercase transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Email (STRICTLY READ-ONLY) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#111111] uppercase tracking-[0.06em]">
                Email Address
              </label>
              <span className="text-[10px] text-[#888888] flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3 text-[#C49B82]" /> Read-only
              </span>
            </div>
            <input
              type="email"
              value={user.email}
              disabled
              readOnly
              className="w-full h-11 rounded-xl bg-[#EDE8E4]/70 border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#777777] cursor-not-allowed select-none focus:outline-none"
            />
            <p className="text-[11px] text-[#888888]">
              Your registered email cannot be changed for security purposes.
            </p>
          </div>

          {/* Username (Editable without Password) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#111111] uppercase tracking-[0.06em]">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C49B82] transition"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-transparent text-[#666666] hover:text-[#111111] font-bold text-xs uppercase transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isDeletingImage}
              className="px-6 py-2.5 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
