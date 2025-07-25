const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nlp = require('compromise');
nlp.extend(require('compromise-stats'));
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'texts/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

function analyzeTexts() {
  const textsDir = path.join(__dirname, 'texts');
  
  return new Promise((resolve, reject) => {
    fs.readdir(textsDir, (err, files) => {
      if (err) {
        return reject(err);
      }

      const textFiles = files.filter(file => file.endsWith('.txt'));
      
      if (textFiles.length === 0) {
        return resolve({ patterns: [], posPatterns: [], message: 'No text files found' });
      }

      const texts = textFiles.map(file => {
        return fs.readFileSync(path.join(textsDir, file), 'utf8');
      });

      const docs = texts.map(text => nlp(text));
      const allNgrams = docs.map(doc => doc.ngrams({ max: 15, min: 3 }).map(ngram => ngram.normal));

      const commonNgrams = allNgrams[0].filter(ngram => {
        return allNgrams.every(ngrams => ngrams.includes(ngram));
      });

      const patterns = commonNgrams.map(ngram => {
        const count = allNgrams.reduce((acc, ngrams) => {
          return acc + ngrams.filter(n => n === ngram).length;
        }, 0);
        return { pattern: ngram, count: count, length: ngram.split(' ').length };
      });

      patterns.sort((a, b) => b.length - a.length);

      const allPosTags = docs.map(doc => {
        const terms = doc.terms().json();
        return terms.map(term => term.terms[0].tags[0]);
      });

      function getPosNgrams(tags, min, max) {
        const ngrams = [];
        for (let n = min; n <= max; n++) {
          if (n > tags.length) {
            continue;
          }
          for (let i = 0; i <= tags.length - n; i++) {
            ngrams.push(tags.slice(i, i + n).join(' '));
          }
        }
        return ngrams;
      }

      const allPosNgrams = allPosTags.map(tags => getPosNgrams(tags, 3, 15));

      let posPatterns = [];
      if (allPosNgrams.length > 0 && allPosNgrams[0].length > 0) {
        const commonPosNgrams = allPosNgrams[0].filter(ngram => {
          return allPosNgrams.every(ngrams => ngrams.includes(ngram));
        });

        posPatterns = commonPosNgrams.map(ngram => {
          const count = allPosNgrams.reduce((acc, ngrams) => {
            return acc + ngrams.filter(n => n === ngram).length;
          }, 0);
          return { pattern: ngram, count: count, length: ngram.split(' ').length };
        });

        posPatterns.sort((a, b) => b.length - a.length);
      }

      resolve({ patterns, posPatterns, filesAnalyzed: textFiles.length });
    });
  });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.array('textFiles'), (req, res) => {
  res.json({ message: 'Files uploaded successfully', files: req.files.map(f => f.filename) });
});

app.get('/analyze', async (req, res) => {
  try {
    const result = await analyzeTexts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/files', (req, res) => {
  const textsDir = path.join(__dirname, 'texts');
  fs.readdir(textsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const textFiles = files.filter(file => file.endsWith('.txt'));
    res.json({ files: textFiles });
  });
});

app.delete('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'texts', filename);
  
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});