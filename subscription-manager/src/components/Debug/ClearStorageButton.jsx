// 清除本地存儲的調試按鈕

const ClearStorageButton = () => {
  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleClearStorage}
        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
        title="清除本地存儲（調試用）"
      >
        🗑️ 清除存儲
      </button>
    </div>
  );
};

export default ClearStorageButton;