import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShareIcon, DocumentDuplicateIcon, CheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface CollaborationShareProps {
  resumeText: string;
}

const CollaborationShare: React.FC<CollaborationShareProps> = ({ resumeText }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const handleCreateShareLink = () => {
    // In a real implementation, you would create a server-side entry with the resume text
    // and return a shareable link. Here we're just simulating that.
    const mockShareId = Math.random().toString(36).substring(2, 10);
    const shareLink = `${window.location.origin}/shared/${mockShareId}`;
    setShareLink(shareLink);
  };
  
  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };
  
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send the email through your backend
    // Here we're just simulating the send
    
    setTimeout(() => {
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setEmail('');
        setName('');
        setMessage('');
      }, 3000);
    }, 1500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <ShareIcon className="h-6 w-6 text-pink-500 mr-2" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Collaborate & Get Feedback</h2>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Share your resume with mentors, colleagues, or career coaches to get personalized feedback.
        </p>
        
        {!showShareOptions ? (
          <button
            onClick={() => setShowShareOptions(true)}
            className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md shadow-sm transition-colors flex items-center justify-center"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Share for Feedback
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Share link section */}
            <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-md font-medium text-slate-800 dark:text-white">
                Create Shareable Link
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate a private link that lets others view your resume and provide feedback
              </p>
              
              {!shareLink ? (
                <button
                  onClick={handleCreateShareLink}
                  className="py-2 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium rounded-md transition-colors text-sm flex items-center"
                >
                  <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                  Generate Share Link
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-white dark:bg-slate-900 
                             border-slate-300 dark:border-slate-600 focus:outline-none 
                             text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="py-2 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 
                             dark:hover:bg-slate-600 text-slate-800 dark:text-white 
                             font-medium rounded-md transition-colors text-sm flex items-center"
                  >
                    {linkCopied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {/* Email invite section */}
            <div className="space-y-3">
              <h3 className="text-md font-medium text-slate-800 dark:text-white">
                Email for Review
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Send your resume directly to mentors or career coaches for review
              </p>
              
              <form onSubmit={handleSendEmail} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-900 
                             border-slate-300 dark:border-slate-600 focus:outline-none 
                             focus:ring-2 focus:ring-pink-500 text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Recipient's Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-900 
                             border-slate-300 dark:border-slate-600 focus:outline-none 
                             focus:ring-2 focus:ring-pink-500 text-sm"
                    placeholder="mentor@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-900 
                             border-slate-300 dark:border-slate-600 focus:outline-none 
                             focus:ring-2 focus:ring-pink-500 text-sm resize-none"
                    placeholder="Hi, I'd appreciate your feedback on my resume..."
                    rows={3}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={emailSent}
                  className="py-2 px-4 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 
                           text-white font-medium rounded-md transition-colors text-sm 
                           flex items-center"
                >
                  {emailSent ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Send Resume
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="pt-4 text-center">
              <button
                onClick={() => setShowShareOptions(false)}
                className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CollaborationShare;
