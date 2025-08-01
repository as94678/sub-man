// 郵件調試工具
import React, { useState } from 'react';

const EmailDebugger = ({ emailDetails }) => {
  const [showRaw, setShowRaw] = useState(false);

  const downloadAsJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      alert('JSON 已複製到剪貼板');
    });
  };

  if (!emailDetails || !emailDetails.rawMessage) return null;

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium mb-3">🔍 郵件調試工具</h4>
      
      <div className="space-y-2">
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          {showRaw ? '隱藏' : '顯示'} 原始 JSON
        </button>
        
        <button
          onClick={() => downloadAsJSON(emailDetails.rawMessage, `email-${emailDetails.id}.json`)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 ml-2"
        >
          下載 JSON 檔案
        </button>
        
        <button
          onClick={() => copyToClipboard(emailDetails.rawMessage)}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 ml-2"
        >
          複製 JSON
        </button>
      </div>

      {showRaw && (
        <div className="mt-4">
          <h5 className="font-medium mb-2">原始 Gmail API 響應：</h5>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(emailDetails.rawMessage, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>ID:</strong> {emailDetails.id}</p>
        <p><strong>寄件者:</strong> {emailDetails.from}</p>
        <p><strong>主旨:</strong> {emailDetails.subject}</p>
        <p><strong>內容預覽:</strong> {emailDetails.body ? emailDetails.body.substring(0, 100) + '...' : '無內容'}</p>
      </div>
    </div>
  );
};

export default EmailDebugger;