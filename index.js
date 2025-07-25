const nlp = require('compromise');
nlp.extend(require('compromise-stats'));
const fs = require('fs');
const path = require('path');

const textsDir = path.join(__dirname, 'texts');

fs.readdir(textsDir, (err, files) => {
  if (err) {
    return console.error('Could not list the directory.', err);
  }

  const texts = files.map(file => {
    return fs.readFileSync(path.join(textsDir, file), 'utf8');
  });

  const docs = texts.map(text => nlp(text));
  const allNgrams = docs.map(doc => doc.ngrams({ max: 15, min: 3 }).map(ngram => ngram.normal));

  const commonNgrams = allNgrams[0].filter(ngram => {
    return allNgrams.every(ngrams => ngrams.includes(ngram));
  });

  const result = commonNgrams.map(ngram => {
    const count = allNgrams.reduce((acc, ngrams) => {
      return acc + ngrams.filter(n => n === ngram).length;
    }, 0);
    return { pattern: ngram, count: count, length: ngram.split(' ').length };
  });

  result.sort((a, b) => b.length - a.length);

  result.forEach((item, index) => {
    let rank;
    const num = index + 1;
    let suffix;
    if (num % 100 >= 11 && num % 100 <= 13) {
      suffix = 'th';
    } else {
      switch (num % 10) {
        case 1:
          suffix = 'st';
          break;
        case 2:
          suffix = 'nd';
          break;
        case 3:
          suffix = 'rd';
          break;
        default:
          suffix = 'th';
      }
    }
    rank = `${num}${suffix} longest`;
    console.log(`${rank} pattern: "${item.pattern}" (Occurrences: ${item.count})`);
  });

  console.log('\n--- POS Patterns ---');

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

  if (allPosNgrams.length > 0 && allPosNgrams[0].length > 0) {
      const commonPosNgrams = allPosNgrams[0].filter(ngram => {
        return allPosNgrams.every(ngrams => ngrams.includes(ngram));
      });

      const posResult = commonPosNgrams.map(ngram => {
        const count = allPosNgrams.reduce((acc, ngrams) => {
          return acc + ngrams.filter(n => n === ngram).length;
        }, 0);
        return { pattern: ngram, count: count, length: ngram.split(' ').length };
      });

      posResult.sort((a, b) => b.length - a.length);

      posResult.forEach((item, index) => {
        let rank;
        const num = index + 1;
        let suffix;
        if (num % 100 >= 11 && num % 100 <= 13) {
          suffix = 'th';
        } else {
          switch (num % 10) {
            case 1:
              suffix = 'st';
              break;
            case 2:
              suffix = 'nd';
              break;
            case 3:
              suffix = 'rd';
              break;
            default:
              suffix = 'th';
          }
        }
        rank = `${num}${suffix} longest`;
        console.log(`${rank} POS pattern: "${item.pattern}" (Occurrences: ${item.count})`);
      });
  } else {
      console.log('No POS patterns found.');
  }
});
