const { generateJspl } = require('../utils/jspl-generator');
const { DataDomeGenerator } = require('../datadome');

// Minimal smoke test using the same constants from datadome.js
const fingerprint_data = require('../datadome').__fingerprint_data || null;

(async () => {
   try {
      const ddjskey = 'AE3F04AD3F0D3A462481A337485081';
      const datadome_cookie_for_payload =
         'dDdzOrLaUHCzQAysqXlVsXxTCb40Vzr52rNglWTCje5vF66sRgz1PQ9nt~P1MDSvn5yQsO1cmH0lp7xSIVqAlHeqIDL5nqXOvAZD1cDEAg1Da7rZBOblg11D33gNAYWR';

      if (!fingerprint_data) {
         console.warn('No fingerprint_data exported for quick test; using a small sample');
      }

      const data = fingerprint_data || { ua: 'test-agent', tz: 420 };

      const jspl = generateJspl(data, ddjskey, datadome_cookie_for_payload);
      console.log('jspl (utils):', jspl.slice(0, 64) + '...');

      // Cross-check using DataDomeGenerator if available
      if (DataDomeGenerator) {
         const gen = new DataDomeGenerator(ddjskey, datadome_cookie_for_payload);
         const jspl2 = gen.generatePayload(data);
         console.log('jspl (DataDomeGenerator):', jspl2.slice(0, 64) + '...');
         console.log('same length?', jspl.length === jspl2.length);
      }
   } catch (e) {
      console.error('Test failed:', e.message);
   }
})();
