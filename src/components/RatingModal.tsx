import React from 'react';
import { X, Star } from 'lucide-react';
import { AppUser, Job } from '../types';

interface RatingModalProps {
  ratingModal: {
    isOpen: boolean;
    jobId: string;
    targetUserId: string;
    role: 'senior' | 'student';
  } | null;
  users: AppUser[];
  ratingForm: { stars: number; comment: string };
  onClose: () => void;
  onRatingFormChange: (form: { stars: number; comment: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  ratingModal,
  users,
  ratingForm,
  onClose,
  onRatingFormChange,
  onSubmit,
}) => {
  if (!ratingModal) return null;
  const targetUser = users.find((u) => u.id === ratingModal.targetUserId);
  if (!targetUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-brand-dark p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Bewertung abgeben</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-center text-slate-600 mb-6">
            Wie war deine Erfahrung mit{' '}
            <span className="font-bold text-brand-dark">{targetUser.name}</span>?
          </p>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onRatingFormChange({ ...ratingForm, stars: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= ratingForm.stars ? 'text-brand-yellow fill-current' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kommentar (optional)
              </label>
              <textarea
                className="w-full p-3 border border-slate-200 rounded-xl focus:border-brand-blue outline-none min-h-[100px]"
                value={ratingForm.comment}
                onChange={(e) => onRatingFormChange({ ...ratingForm, comment: e.target.value })}
                placeholder="Schreibe einen kurzen Kommentar..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold transition-colors"
            >
              Bewertung absenden
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
