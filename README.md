# Longest Shared Pattern Detection Program

## Overview
This program identifies the longest shared patterns (phrases) that appear in multiple text files and displays them along with their occurrence counts. The application now includes both a command-line interface and a modern web interface.

## Features
- **Web Interface**: Modern, user-friendly frontend for easy file upload and analysis
- **Command Line Interface**: Original CLI functionality for programmatic use
- Extracts n-grams (sequences of words) from each text using the `compromise` library
- Identifies n-grams that are common to all texts
- Counts the occurrences of each common pattern
- Identifies common Part-of-Speech (POS) patterns across all texts
- Sorts the results by length in descending order and displays them with their rank (e.g., "1st longest", "2nd longest")
- **File Management**: Upload, view, and delete text files through the web interface
- **Real-time Analysis**: Instant pattern detection with visual results

## Requirements
- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

## Setup
1. After cloning or downloading the project, navigate to the project root directory.
2. Install the necessary npm packages.
   ```bash
   npm install
   ```

## Usage

### Web Interface (Recommended)
1. Start the web server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`
3. Upload your text files (.txt format) using the drag-and-drop interface or file selector
4. Click "Analyze Patterns" to detect common patterns
5. View results in two tabs:
   - **Text Patterns**: Common phrases found across all files
   - **POS Patterns**: Common part-of-speech sequences

### Command Line Interface
1. Place your text files (.txt format) into the `texts` folder:
   ```
   /your-project-root/
   ├── index.js
   ├── server.js
   ├── package.json
   ├── public/
   │   ├── index.html
   │   ├── style.css
   │   └── script.js
   └── texts/
       ├── text1.txt
       ├── text2.txt
       └── text3.txt
   ```
2. Run the CLI program:
   ```bash
   node index.js
   ```

## Example Output
```
1st longest pattern: "this is a very long common phrase that appears in all texts" (Occurrences: 3)
2nd longest pattern: "this is a very long common phrase that appears in all" (Occurrences: 3)
3rd longest pattern: "is a very long common phrase that appears in all texts" (Occurrences: 3)
...

--- POS Patterns ---
1st longest POS pattern: "DT VBZ DT RB JJ JJ NN WDT VBZ IN DT NNS" (Occurrences: 3)
2nd longest POS pattern: "VBZ DT RB JJ JJ NN WDT VBZ IN DT NNS" (Occurrences: 3)
3rd longest POS pattern: "DT RB JJ JJ NN WDT VBZ IN DT NNS" (Occurrences: 3)
...
```

## Web Interface Features

### Modern UI/UX
- **Responsive Design**: Works on desktop and mobile devices
- **Drag & Drop**: Easy file upload with visual feedback
- **Real-time Updates**: Live file management and analysis status
- **Tabbed Results**: Organized display of text and POS patterns
- **Progress Indicators**: Loading animations and status messages

### File Management
- **Multi-file Upload**: Support for multiple .txt files simultaneously
- **File List Display**: View all uploaded files with delete options
- **Clear All**: Remove all files with a single click
- **File Validation**: Automatic filtering for .txt files only

### Analysis Display
- **Pattern Ranking**: Results sorted by length with ordinal ranking (1st, 2nd, 3rd, etc.)
- **Occurrence Count**: Shows how many times each pattern appears
- **Pattern Length**: Displays word/tag count for each pattern
- **No Results Handling**: Clear messaging when no patterns are found

## Webフロント実装の詳細解説

### アーキテクチャ概要
このWebアプリケーションは、Express.jsを使用したサーバーサイドとVanilla JavaScriptを使用したフロントエンドで構成されています。

### フロントエンド実装（public/ディレクトリ）

#### HTML構造 (index.html:1-76)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Pattern Detection Tool</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Text Pattern Detection Tool</h1>
        </header>
        <main>
            <!-- ファイルアップロードセクション -->
            <section class="upload-section">
                <div class="upload-area" id="uploadArea">
                    <input type="file" id="fileInput" multiple accept=".txt">
                </div>
            </section>
            
            <!-- コントロールボタン -->
            <section class="controls-section">
                <button id="analyzeBtn" class="analyze-btn">Analyze Patterns</button>
                <button id="clearBtn" class="clear-btn">Clear Files</button>
            </section>
            
            <!-- 結果表示エリア -->
            <section class="results-section" id="resultsSection">
                <div class="tabs">
                    <button class="tab-btn active" data-tab="patterns">Text Patterns</button>
                    <button class="tab-btn" data-tab="pos">POS Patterns</button>
                </div>
                <!-- タブコンテンツ -->
            </section>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

#### JavaScript実装 (script.js:1-315)

**メインクラス構造:**
```javascript
class PatternDetectionApp {
    constructor() {
        this.hiddenFiles = new Set();  // 非表示ファイル管理
        this.allFiles = [];            // 全ファイルリスト
        this.init();
    }
}
```

**主要メソッド:**

1. **ファイル操作系 (script.js:55-123)**
   - `uploadFiles()`: FormDataを使用したマルチファイルアップロード
   - `loadExistingFiles()`: サーバーからファイル一覧取得
   - `hideFile()`: ファイルの論理削除（UI上から非表示）
   - `clearFiles()`: 全ファイルクリア

2. **UI操作系 (script.js:13-46)**
   - `setupEventListeners()`: イベントリスナー設定
   - `handleDragOver()`/`handleDrop()`: ドラッグ&ドロップ対応
   - `handleFileSelect()`: ファイル選択ハンドリング

3. **パターン解析系 (script.js:130-188)**
   - `analyzePatterns()`: サーバーへ解析リクエスト送信
   - `displayResults()`: 解析結果の表示処理
   - `formatPosWithText()`: POS品詞タグと単語の対応表示

4. **UI状態管理 (script.js:239-312)**
   - `switchTab()`: タブ切り替え機能
   - `showLoading()`/`hideLoading()`: ローディング状態表示
   - `showError()`/`showMessage()`: エラー・成功メッセージ表示

#### CSS実装 (style.css:1-490)

**デザインシステム:**
- **カラーパレット**: グラデーション背景（#667eea → #764ba2）
- **タイポグラフィ**: システムフォント使用
- **レスポンシブデザイン**: モバイル対応（@media 768px以下）

**主要コンポーネント:**

1. **アップロードエリア (style.css:55-82)**
```css
.upload-area {
    border: 3px dashed #667eea;
    border-radius: 10px;
    padding: 40px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.upload-area:hover, .upload-area.dragover {
    border-color: #764ba2;
    background: #f0f2ff;
    transform: translateY(-2px);
}
```

2. **POS品詞タグ視覚化 (style.css:300-401)**
```css
.pos-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    color: white;
    background-color: #bdc3c7;
}

/* 品詞別カラーコーディング */
.pos-NN { background-color: #3498db !important; }  /* 名詞：青 */
.pos-VB { background-color: #e74c3c !important; }  /* 動詞：赤 */
.pos-JJ { background-color: #f39c12 !important; }  /* 形容詞：オレンジ */
```

### サーバーサイド実装 (server.js:1-177)

#### Express.js設定
```javascript
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
```

#### ファイルアップロード (server.js:16-25)
```javascript
const storage = multer.diskStorage({
  destination: 'texts/',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });
```

#### パターン解析エンジン (server.js:27-133)

**自然言語処理:**
```javascript
const nlp = require('compromise');
nlp.extend(require('compromise-stats'));

// テキスト解析
const docs = texts.map(text => nlp(text));
const allNgrams = docs.map(doc => 
  doc.ngrams({ max: 15, min: 3 }).map(ngram => ngram.normal)
);

// 共通パターン抽出
const commonNgrams = allNgrams[0].filter(ngram => {
  return allNgrams.every(ngrams => ngrams.includes(ngram));
});
```

**品詞（POS）解析:**
```javascript
const allPosTags = docs.map(doc => {
  const terms = doc.terms().json();
  return terms.map(term => term.terms[0].tags[0]);
});

function getPosNgramsWithText(tags, words, min, max) {
  const ngrams = [];
  for (let n = min; n <= max; n++) {
    for (let i = 0; i <= tags.length - n; i++) {
      const posPattern = tags.slice(i, i + n).join(' ');
      const textPattern = words.slice(i, i + n).join(' ');
      ngrams.push({ pos: posPattern, text: textPattern });
    }
  }
  return ngrams;
}
```

#### RESTful API エンドポイント
- `POST /upload`: ファイルアップロード処理
- `GET /analyze`: パターン解析実行
- `GET /files`: アップロード済みファイル一覧
- `DELETE /files/:filename`: ファイル削除

### 技術的特徴

1. **フロントエンド**
   - Vanilla JavaScript ES6+クラス構文使用
   - Fetch APIによる非同期通信
   - CSS Grid/Flexboxレイアウト
   - ドラッグ&ドロップファイル操作

2. **バックエンド**
   - Node.js + Express.js
   - Compromise.js自然言語処理
   - Multerファイルアップロード
   - CORS対応

3. **UI/UX設計**
   - レスポンシブデザイン
   - 直感的なファイル操作
   - リアルタイムフィードバック
   - アクセシビリティ配慮

## API Endpoints
The web server provides the following REST API endpoints:

- `GET /` - Serve the main web interface
- `POST /upload` - Upload multiple text files
- `GET /analyze` - Analyze patterns in uploaded files
- `GET /files` - List all uploaded files
- `DELETE /files/:filename` - Delete a specific file

## Libraries Used
- [compromise](https://compromise.cool/) (Natural Language Processing library)
- [compromise-stats](https://www.npmjs.com/package/compromise-stats) (compromise statistics plugin)
- [Express.js](https://expressjs.com/) (Web server framework)
- [Multer](https://www.npmjs.com/package/multer) (File upload handling)
- [CORS](https://www.npmjs.com/package/cors) (Cross-origin resource sharing)

## Developer
- [Outtech105k](https://github.com/Outtech105k)
- [ressharu](https://github.com/ressharu)
