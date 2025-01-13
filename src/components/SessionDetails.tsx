'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Edit2, Save, X, Link2, Copy, Share2, Check } from 'lucide-react';

interface SessionDetailsProps {
  session: {
    id: number;
    name: string;
    email: string;
    programName: string;
    sessionDate: string;
    sessionTime: string;
    sessionType: string;
    teamsLink?: string;
  };
  onClose: () => void;
  onUpdate: (id: number, teamsLink: string) => Promise<void>;
}

export default function SessionDetails({ session, onClose, onUpdate }: SessionDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [teamsLink, setTeamsLink] = useState(session.teamsLink || '');
  const [isCopied, setIsCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await onUpdate(session.id, teamsLink);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update session:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!teamsLink) return;
    try {
      await navigator.clipboard.writeText(teamsLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = async () => {
    if (!teamsLink) return;
    try {
      await navigator.share({
        title: `${session.programName} - Teams Meeting`,
        text: `Join the Teams meeting for ${session.programName}`,
        url: teamsLink
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Session Details
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Program</p>
              <p className="font-medium text-gray-900 dark:text-white">{session.programName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Presenter</p>
              <p className="font-medium text-gray-900 dark:text-white">{session.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
              <p className="font-medium text-gray-900 dark:text-white">{session.sessionDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
              <p className="font-medium text-gray-900 dark:text-white">{session.sessionTime}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Teams Meeting Link</p>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="url"
                  value={teamsLink}
                  onChange={(e) => setTeamsLink(e.target.value)}
                  placeholder="Enter Teams meeting link"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : teamsLink ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Link2 className="w-4 h-4" />
                  <a
                    href={teamsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 truncate"
                  >
                    {teamsLink}
                  </a>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">QR Code</p>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <QRCodeSVG value={teamsLink} size={200} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No Teams meeting link added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 