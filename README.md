# 🎀 SUB-MAN 訂閱小管家

> 一個現代化的全端訂閱管理系統，幫助您輕鬆追蹤和管理所有訂閱服務

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS-blue?logo=tailwindcss)

## 📖 專案介紹

SUB-MAN 是一個功能完整的訂閱管理平台，從簡單的個人工具發展為企業級的 SaaS 應用。無論您是想追蹤個人訂閱，還是為團隊提供訂閱管理服務，SUB-MAN 都能滿足您的需求。

### 🎯 核心特色

- **🚀 即開即用** - 支援訪客模式，無需註冊即可體驗完整功能
- **🔐 安全可靠** - 完整的用戶認證系統，JWT 加密保護
- **💾 永久保存** - 資料存儲在 PostgreSQL 資料庫，永不遺失
- **👥 多用戶支援** - 每個用戶擁有獨立的資料空間
- **🌍 多幣別支援** - 支援多種貨幣，自動匯率轉換
- **📱 響應式設計** - 完美適配桌面、平板、手機各種裝置
- **🎨 現代化界面** - 支援深色/淺色主題切換

## ✨ 功能亮點

### 📊 多種視圖模式
- **儀錶板** - 總覽您的訂閱狀況和支出統計
- **圖表分析** - 視覺化的支出分析和類別分布
- **日曆視圖** - 清楚顯示所有訂閱的續費日期
- **清單模式** - 詳細的訂閱清單管理

### 💰 智能財務管理
- **多幣別支援** - USD、TWD、EUR、JPY 等主要貨幣
- **即時匯率** - 自動獲取最新匯率進行轉換
- **支出統計** - 按類別統計月度支出
- **續費提醒** - 即將到期的訂閱服務提醒

### 👤 完整會員系統
- **帳戶管理** - 修改個人資料、密碼
- **使用統計** - 訂閱數量、總支出等統計資訊
- **安全設定** - 安全的密碼修改和帳戶刪除
- **跨裝置同步** - 登入後可在任何裝置存取資料

### 🎛 訂閱管理功能
- **新增訂閱** - 支援自定義名稱、價格、貨幣、類別
- **編輯修改** - 隨時更新訂閱資訊
- **分類管理** - 娛樂、工具、音樂、健身、學習等分類
- **快速操作** - 直觀的操作界面，一鍵完成各種操作

## 🛠 技術架構

### 前端技術棧
- **框架**: React 18.2.0 + Vite
- **樣式**: Tailwind CSS
- **圖表**: Recharts
- **圖示**: Lucide React
- **狀態管理**: React Hooks + Context API

### 後端技術棧
- **運行環境**: Node.js
- **框架**: Express.js
- **資料庫 ORM**: Prisma
- **資料庫**: PostgreSQL (開發環境支援 SQLite)
- **認證**: JWT (JSON Web Tokens)
- **密碼加密**: bcryptjs

### 開發工具
- **代碼檢查**: ESLint
- **版本控制**: Git
- **包管理**: npm

## 🚀 快速開始

### 環境需求
- Node.js 16+ 
- npm 或 yarn
- PostgreSQL (可選，開發時可用 SQLite)

### 1. 克隆專案
```bash
git clone https://github.com/YOUR_USERNAME/subscription-manager.git
cd subscription-manager
```

### 2. 安裝依賴

**安裝前端依賴:**
```bash
cd subscription-manager
npm install
```

**安裝後端依賴:**
```bash
cd ../backend
npm install
```

### 3. 設定環境變數

在 `backend` 目錄建立 `.env` 檔案：
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 4. 初始化資料庫
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. 啟動應用

**啟動後端服務:**
```bash
cd backend
npm run dev
```

**啟動前端應用:**
```bash
cd subscription-manager
npm run dev
```

### 6. 開始使用
打開瀏覽器，訪問 `http://localhost:5173`

## 📱 使用指南

### 🎯 訂閱管理流程

#### 1. **開始使用**
- 打開應用後，您會看到乾淨的界面
- 可以直接在訪客模式下體驗所有功能
- 點擊右上角「登入」按鈕註冊會員以享受資料同步

#### 2. **新增訂閱**
- 點擊右下角的浮動 **「+」** 按鈕
- 或在任何頁面點擊「新增訂閱」按鈕
- 填寫訂閱資訊：
  - **服務名稱**: 如 Netflix、Spotify
  - **價格**: 月費金額
  - **貨幣**: 選擇對應貨幣
  - **續費日期**: 下次扣款日期
  - **類別**: 選擇對應分類
  - **顏色**: 自定義顏色標識

#### 3. **管理訂閱**
- **查看**: 在不同視圖間切換查看訂閱
- **編輯**: 點擊訂閱項目進行修改
- **刪除**: 在清單模式中刪除不需要的訂閱
- **統計**: 在儀錶板查看支出統計

#### 4. **會員功能**
- **註冊**: 點擊右上角「登入」→「註冊新帳戶」
- **個人資料**: 用戶選單 → 「會員管理」
- **修改密碼**: 在會員管理頁面的「修改密碼」分頁
- **查看統計**: 在「帳戶統計」查看使用情況

### 🎛 操作技巧

#### 快速導航
- **F** - 切換到儀錶板
- **C** - 切換到圖表視圖  
- **L** - 切換到清單模式
- **+** - 快速新增訂閱

#### 貨幣轉換
- 點擊 Header 的「匯率」按鈕查看匯率轉換器
- 點擊「🔄」按鈕更新匯率
- 在下拉選單中切換基準貨幣

#### 主題切換
- 點擊右上角的 🌙/☀️ 按鈕切換深色/淺色主題
- 設定會自動保存

## 📸 功能截圖

### 🏠 儀錶板視圖
顯示總體統計、即將到期的訂閱，以及快速操作按鈕。

### 📊 圖表分析
- 餅圖顯示各類別支出比例
- 長條圖顯示支出排行
- 視覺化的資料分析

### 📅 日曆視圖
以日曆形式顯示所有訂閱的續費日期，方便規劃預算。

### 📋 清單管理
完整的訂閱清單，支援排序、篩選和批量操作。

### 👤 會員管理
完整的個人資料管理，包含統計資訊和安全設定。

## 🎯 使用場景

### 個人用戶
- **學生**: 管理 Netflix、Spotify、學習平台訂閱
- **上班族**: 追蹤工作工具、娛樂服務、健身房會員
- **自由工作者**: 管理各種專業工具和服務訂閱

### 家庭用戶
- **家庭預算**: 統計全家的訂閱支出
- **共享服務**: 管理家庭共享的串流服務
- **孩子教育**: 追蹤線上學習平台費用

### 小型企業
- **工具管理**: 追蹤團隊使用的 SaaS 工具
- **成本控制**: 分析各部門的軟體支出
- **預算規劃**: 預測未來的軟體採購需求

## 🔧 進階設定

### 資料庫配置
如果要使用 PostgreSQL 而非 SQLite：

1. 安裝 PostgreSQL
2. 建立資料庫
3. 修改 `.env` 中的 `DATABASE_URL`：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/subscription_manager"
```
4. 重新執行 `npx prisma db push`

### 部署設定
專案已準備好部署到各種平台：

- **前端**: Vercel、Netlify、GitHub Pages
- **後端**: Railway、Render、Heroku
- **資料庫**: Railway PostgreSQL、Supabase、PlanetScale

## 🤝 貢獻指南

歡迎為專案做出貢獻！請遵循以下步驟：

1. Fork 這個專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 建立 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 🙏 致謝

- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Prisma](https://www.prisma.io/) - 資料庫 ORM
- [Lucide](https://lucide.dev/) - 圖示庫
- [Recharts](https://recharts.org/) - 圖表庫

## 📞 聯絡資訊

如果您有任何問題或建議，歡迎：
- 建立 [Issue](https://github.com/YOUR_USERNAME/subscription-manager/issues)
- 發送 Pull Request
- 聯繫專案維護者

---

⭐ 如果這個專案對您有幫助，請給我們一個 Star！

🤖 Built with [Claude Code](https://claude.ai/code)