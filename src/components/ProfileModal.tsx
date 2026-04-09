import React from 'react';
import {
  X, User, ShieldCheck, Sparkles, Star, MapPin, Coins, Calendar, Edit2, Camera,
} from 'lucide-react';
import { AppUser } from '../types';

interface ProfileModalProps {
  profileModalUserId: string | null;
  users: AppUser[];
  currentUser: AppUser | null;
  isEditingProfile: boolean;
  profileForm: { name: string; bio: string; avatarUrl: string };
  onClose: () => void;
  onStartEdit: () => void;
  onSaveProfile: (e: React.FormEvent) => void;
  onProfileFormChange: (form: { name: string; bio: string; avatarUrl: string }) => void;
  onProfileImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profileModalUserId,
  users,
  currentUser,
  isEditingProfile,
  profileForm,
  onClose,
  onStartEdit,
  onSaveProfile,
  onProfileFormChange,
  onProfileImageUpload,
}) => {
  if (!profileModalUserId) return null;
  const profileUser = users.find((u) => u.id === profileModalUserId);
  if (!profileUser) return null;

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-brand-dark p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Profil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto hide-scrollbar">
          {isEditingProfile && isOwnProfile ? (
            <form onSubmit={onSaveProfile} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    {profileForm.avatarUrl ? (
                      <img
                        src={profileForm.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-brand-blue text-white p-2 rounded-full shadow-md hover:bg-brand-blue-hover cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        onProfileImageUpload(e, (url) =>
                          onProfileFormChange({ ...profileForm, avatarUrl: url })
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:border-brand-blue outline-none"
                  value={profileForm.name}
                  onChange={(e) => onProfileFormChange({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Über mich</label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-xl focus:border-brand-blue outline-none min-h-[100px]"
                  value={profileForm.bio}
                  onChange={(e) => onProfileFormChange({ ...profileForm, bio: e.target.value })}
                  placeholder="Erzähle etwas über dich..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold transition-colors"
                >
                  Speichern
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md mb-4">
                  {profileUser.avatarUrl ? (
                    <img
                      src={profileUser.avatarUrl}
                      alt={profileUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-brand-blue">
                      {profileUser.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-brand-dark flex items-center gap-2 justify-center">
                  {profileUser.name}
                  {profileUser.verified && (
                    <ShieldCheck className="w-6 h-6 text-emerald-500" title="Verifiziertes Profil" />
                  )}
                  {profileUser.curaPlus && (
                    <Sparkles className="w-6 h-6 text-brand-yellow" title="Cura+ Premium" />
                  )}
                </h3>
                <p className="text-slate-500 font-medium flex items-center gap-2 justify-center mt-1">
                  {profileUser.role === 'senior' ? 'Senior/in' : 'Helfer/in'}
                  {profileUser.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {profileUser.location}
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-brand-yellow font-bold text-lg">
                      <Star className="w-5 h-5 fill-current" />
                      {profileUser.rating?.toFixed(1) || 'Neu'}
                    </div>
                    <span className="text-xs text-slate-500">
                      {profileUser.reviewCount || 0} Bewertungen
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-brand-dark text-lg">
                      {profileUser.joinedDate || 'Neu dabei'}
                    </span>
                    <span className="text-xs text-slate-500">Mitglied</span>
                  </div>
                  {profileUser.role === 'student' && (
                    <>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-brand-yellow text-lg flex items-center gap-1">
                          <Coins className="w-4 h-4" /> {profileUser.curaCoins || 0}
                        </span>
                        <span className="text-xs text-slate-500">CuraCoins</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {profileUser.bio && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-brand-dark mb-2">Über mich</h4>
                  <p className="text-slate-600 leading-relaxed">{profileUser.bio}</p>
                </div>
              )}

              {profileUser.role === 'student' && profileUser.skills && profileUser.skills.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-brand-dark mb-3">Fähigkeiten</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profileUser.role === 'student' &&
                profileUser.availability &&
                profileUser.availability.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-brand-dark mb-3">Verfügbarkeit</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.availability.map((time) => (
                        <span
                          key={time}
                          className="px-3 py-1.5 bg-brand-yellow/10 border border-brand-yellow/30 text-brand-dark rounded-lg text-sm font-medium flex items-center gap-1.5"
                        >
                          <Calendar className="w-4 h-4" /> {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {profileUser.role === 'senior' &&
                profileUser.needs &&
                profileUser.needs.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-brand-dark mb-3">Bedarfsprofil</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.needs.map((need) => (
                        <span
                          key={need}
                          className="px-3 py-1.5 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue rounded-lg text-sm font-medium"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {isOwnProfile && (
                <button
                  onClick={onStartEdit}
                  className="w-full py-3.5 bg-brand-light hover:bg-blue-50 text-brand-blue rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-blue-100"
                >
                  <Edit2 className="w-5 h-5" />
                  Profil bearbeiten
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
