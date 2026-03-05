import { useState } from 'react';
import { useAppDispatch } from '../../hooks/useRedux';
import { addToast } from '../../store/slices/uiSlice';
import {
  X,
  Link,
  Twitter,
  Facebook,
  Mail,
  Copy,
  Check,
  Share2,
  MessageCircle,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId?: number;
  chapterTitle?: string;
}

const ShareModal = ({ isOpen, onClose, chapterId, chapterTitle }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();

  const shareUrl = chapterId
    ? `${window.location.origin}/read/${chapterId}`
    : window.location.origin;

  const shareText = chapterTitle
    ? `Check out "${chapterTitle}" on Endless Story Engine!`
    : 'Check out Endless Story Engine - an infinite narrative platform!';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      dispatch(
        addToast({
          type: 'success',
          message: 'Link copied to clipboard!',
          duration: 3000,
        })
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to copy link',
          duration: 3000,
        })
      );
    }
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(shareText);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: chapterTitle || 'Endless Story Engine',
          text: shareText,
          url: shareUrl,
        });
        dispatch(
          addToast({
            type: 'success',
            message: 'Shared successfully!',
            duration: 3000,
          })
        );
      } catch (error) {
        // User cancelled or share failed
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Share Chapter
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Chapter Info */}
          {chapterTitle && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sharing</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {chapterTitle}
              </p>
            </div>
          )}

          {/* Copy Link */}
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-700 dark:text-gray-300"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Share on Social Media
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleShareTwitter}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity"
              >
                <Twitter className="w-6 h-6" />
                <span className="text-xs font-medium">Twitter</span>
              </button>

              <button
                onClick={handleShareFacebook}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#4267B2] text-white hover:opacity-90 transition-opacity"
              >
                <Facebook className="w-6 h-6" />
                <span className="text-xs font-medium">Facebook</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#25D366] text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>

              <button
                onClick={handleShareTelegram}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[#0088cc] text-white hover:opacity-90 transition-opacity"
              >
                <Link className="w-6 h-6" />
                <span className="text-xs font-medium">Telegram</span>
              </button>

              <button
                onClick={handleShareEmail}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-600 text-white hover:opacity-90 transition-opacity"
              >
                <Mail className="w-6 h-6" />
                <span className="text-xs font-medium">Email</span>
              </button>

              {typeof navigator.share === 'function' && (
                <button
                  onClick={handleNativeShare}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-600 text-white hover:opacity-90 transition-opacity"
                >
                  <Share2 className="w-6 h-6" />
                  <span className="text-xs font-medium">More</span>
                </button>
              )}
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Embed Code
            </label>
            <div className="relative">
              <pre className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                {`<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`
                  );
                  dispatch(
                    addToast({
                      type: 'success',
                      message: 'Embed code copied!',
                      duration: 3000,
                    })
                  );
                }}
                className="absolute top-2 right-2 p-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;