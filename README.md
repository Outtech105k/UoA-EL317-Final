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
[Your Name or GitHub Username]