// Reusable jspl generator based on the logic used in datadome.js

function hashStrToInt(s, fallback = 1789537805) {
   if (!s) return fallback;
   let o = 0;
   for (let i = 0; i < s.length; i++) {
      o = ((o << 5) - o + s.charCodeAt(i)) | 0;
   }
   return o + 2147483647 + 1; // keep it positive like in try/catch fallback
}

function prngH(n) {
   n ^= n << 13;
   n ^= n >>> 17;
   n ^= n << 5;
   return n | 0;
}

function createKeystreamGenerator(seed1, seed2) {
   let e = seed1;
   let i = -1;
   let r = seed2;
   let a = true;
   let u = null;

   const generator = (get_val = false) => {
      if (u !== null) {
         const t = u;
         u = null;
         return t;
      }

      i++;
      if (i > 2) {
         e = prngH(e);
         i = 0;
      }

      let t = (e >> (16 - 8 * i)) & 0xff;

      if (a) {
         r--;
         t ^= r & 0xff;
      }

      if (get_val) {
         u = t;
      }
      return t;
   };

   a = false;
   return generator;
}

function customB64EncodeChar(n) {
   if (37 < n) return 59 + n;
   if (11 < n) return 53 + n;
   if (1 < n) return 46 + n;
   return 50 * n + 45;
}

function generateJspl(data, key, cookie, opts = {}) {
   if (!data || typeof data !== 'object') throw new Error('data must be an object');
   if (!key || !cookie) throw new Error('key and cookie are required');

   const t = 9959949970; // constant from datadome.js
   const now = typeof opts.timestamp === 'number' ? opts.timestamp : Date.now();

   const seedFromCookie = hashStrToInt(cookie);
   const initialSeed = (t ^ seedFromCookie ^ hashStrToInt(key)) | 0;

   const e = prngH(prngH(((now >> 3) ^ 11027890091) * t));
   const ksA = createKeystreamGenerator(initialSeed, e);

   const stringify = (v) => JSON.stringify(v);
   const encryptStr = (s) => {
      const buf = Buffer.from(s, 'utf8');
      const out = [];
      for (const b of buf) out.push(b ^ ksA());
      return out;
   };

   const payload = [];
   let first = true;
   for (const k in data) {
      if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
      const val = data[k];
      if (!first) payload.push(ksA() ^ 44); // comma
      const kb = encryptStr(stringify(k));
      const vb = encryptStr(stringify(val));
      payload.push(...kb);
      payload.push(ksA() ^ 58); // colon
      payload.push(...vb);
      first = false;
   }

   const ksB = createKeystreamGenerator((1809053797 ^ hashStrToInt(cookie)) | 0, e);
   const xored = payload.map((b) => b ^ ksB());
   xored.push(ksA(true) ^ 125 ^ ksB());

   const outChars = [];
   let w = 0;
   let b = e;
   while (w < xored.length) {
      b = (b - 1) | 0;
      const b1 = (b & 0xff) ^ xored[w++];
      b = (b - 1) | 0;
      const b2 = w < xored.length ? (b & 0xff) ^ xored[w++] : 0;
      b = (b - 1) | 0;
      const b3 = w < xored.length ? (b & 0xff) ^ xored[w++] : 0;
      const z = (b1 << 16) | (b2 << 8) | b3;
      outChars.push(String.fromCharCode(customB64EncodeChar((z >> 18) & 63)));
      outChars.push(String.fromCharCode(customB64EncodeChar((z >> 12) & 63)));
      outChars.push(String.fromCharCode(customB64EncodeChar((z >> 6) & 63)));
      outChars.push(String.fromCharCode(customB64EncodeChar(z & 63)));
   }

   const padding = xored.length % 3;
   if (padding > 0) return outChars.slice(0, -(3 - padding)).join('');
   return outChars.join('');
}

module.exports = { generateJspl };
