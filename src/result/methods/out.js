'use strict';
const ngram = require('./render/ngram');
const edgegram = require('./render/edgegram');
const topk = require('./render/topk');

const render = {
  text: (r) => {
    return r.list.reduce((str, ts) => {
      str += ts.out('text');
      return str;
    }, '');
  },
  normal: (r) => {
    return r.list.map((ts) => {
      let str = ts.out('normal');
      let last = ts.last();
      if (last) {
        let punct = last.endPunctuation();
        if (punct === '.' || punct === '!' || punct === '?') {
          str += punct;
        }
      }
      return str;
    }).join(' ');
  },
  array: (r) => {
    return r.list.reduce((arr, ts) => {
      arr.push(ts.out('text'));
      return arr;
    }, []);
  },
  json: (r) => {
    return r.list.reduce((arr, ts) => {
      let terms = ts.terms.map((t) => {
        return {
          text: t.text,
          normal: t.normal,
          tags: t.tag
        };
      });
      arr.push(terms);
      return arr;
    }, []);
  },
  html: (r) => {
    let html = r.list.reduce((str, ts) => {
      let sentence = ts.terms.reduce((sen, t) => {
        sen += '\n    ' + t.render.html();
        return sen;
      }, '');
      return str += '\n  <span>' + sentence + '\n  </span>';
    }, '');
    return '<span> ' + html + '\n</span>';
  },
  debug: (r) => {
    console.log('====');
    r.list.forEach((ts) => {
      console.log('   --');
      ts.check();
    });
    return r;
  }
};
//render/output methods
const out = (r, method, opts) => {
  if (method === 'text' || method === 'plaintext') {
    return render.text(r);
  }
  if (method === 'normal' || method === 'normalized') {
    return render.normal(r);
  }
  if (method === 'array') {
    return render.array(r);
  }
  if (method === 'json') {
    return render.json(r);
  }
  if (method === 'html') {
    return render.html(r);
  }
  if (method === 'debug' || method === 'pretty') {
    return render.debug(r);
  }
  if (method === 'topk' || method === 'freq' || method === 'frequency') {
    return topk(r);
  }
  if (method === 'ngram') {
    return ngram(r);
  }
  if (method === 'bigram') {
    opts = opts || {
      size: [2]
    };
    return ngram(r, opts);
  }
  if (method === 'trigram') {
    opts = opts || {
      size: [3]
    };
    return ngram(r, opts);
  }
  if (method === 'edgegram') {
    return edgegram.both(r, opts);
  }
  if (method === 'startgram') {
    return edgegram.start(r, opts);
  }
  if (method === 'endgram') {
    return edgegram.end(r, opts);
  }
  return render.text(r);
};
module.exports = out;
