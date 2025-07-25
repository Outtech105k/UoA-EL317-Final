# Longest Shared Pattern Detection Program

## Overview
This program identifies the longest shared patterns (phrases) that appear in multiple text files within a specified folder and displays them along with their occurrence counts.

## Features
- Reads all text files (.txt) from a specified directory.
- Extracts n-grams (sequences of words) from each text using the `compromise` library.
- Identifies n-grams that are common to all texts.
- Counts the occurrences of each common pattern.
- Identifies common Part-of-Speech (POS) patterns across all texts.
- Sorts the results by length in descending order and displays them with their rank (e.g., "1st longest", "2nd longest").

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
1. Place your text files (.txt format) that you want to analyze for common patterns into the `texts` folder located directly under the project root directory.
   Example:
   ```
   /your-project-root/
   ├── index.js
   ├── package.json
   ├── node_modules/
   └── texts/
       ├── text1.txt
       ├── text2.txt
       └── text3.txt
   ```
2. Run the program.
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

## Libraries Used
- [compromise](https://compromise.cool/) (Natural Language Processing library)
- [compromise-stats](https://www.npmjs.com/package/compromise-stats) (compromise statistics plugin)

## Developer
[Your Name or GitHub Username]