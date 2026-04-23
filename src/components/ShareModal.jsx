import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Info, Share2 } from 'lucide-react';

const ShareModal = ({ graphId, allowEdit, setAllowEdit, ownerId, user, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyText = async (text) => {
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}?id=${graphId}`;
  const embedCode = `<iframe src="${window.location.origin}${window.location.pathname}?id=${graphId}&edit=false" width="100%" height="500px" style="border:1px solid #444; border-radius:8px;"></iframe>`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-[#252525] border border-[#444] rounded-xl w-full max-w-lg shadow-2xl animate-in zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-400">
              <Share2 size={24}/> 共有と埋め込み
            </h3>
            <button onClick={onClose} className="text-[#888] hover:text-white">&times;</button>
          </div>

          <div className="space-y-6">
            {user?.uid === ownerId && (
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-gray-200">他者の編集を許可する</p>
                    <p className="text-xs text-gray-500">オフにすると閲覧のみのURLになります</p>
                  </div>
                  <button
                    onClick={() => setAllowEdit(!allowEdit)}
                    className={`w-12 h-6 rounded-full transition-all relative ${allowEdit ? 'bg-purple-600' : 'bg-[#444]'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${allowEdit ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
                <ExternalLink size={12}/> 共有リンク
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-grow bg-[#1a1a1a] border border-[#444] rounded p-2 text-xs text-gray-400 outline-none"
                />
                <button
                  onClick={() => copyText(shareUrl)}
                  className="bg-purple-600 px-4 rounded text-xs font-bold hover:bg-purple-700 whitespace-nowrap"
                >
                  {copied ? <Check size={16}/> : 'URLをコピー'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
                <Copy size={12}/> ブログ埋め込み用コード (iframe)
              </label>
              <div className="relative">
                <textarea
                  readOnly
                  value={embedCode}
                  className="w-full bg-[#1a1a1a] border border-[#444] rounded p-3 text-[10px] text-gray-400 font-mono h-24 outline-none resize-none"
                />
                <button
                  onClick={() => copyText(embedCode)}
                  className="absolute bottom-2 right-2 bg-[#333] hover:bg-[#444] px-3 py-1.5 rounded text-[10px] font-bold border border-[#555]"
                >
                  {copied ? 'コピー済み!' : 'コードをコピー'}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <Info size={10}/> はてなブログやWordPress等のHTMLモードで貼り付けてください
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-[#1a1a1a] rounded-b-xl border-t border-[#444] text-center">
          <button onClick={onClose} className="text-xs text-gray-400 hover:text-white underline">閉じる</button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
