const axios = require('axios');
const { performance } = require('node:perf_hooks'); // High-resolution timer

// Proxy config (HTTP)
const proxyHost = 'p.webshare.io';
const proxyPort = 80;
const username = 'wmycieli-rotate';
const password = 'kcnrnxe04nbk';

// Axios HTTP proxy configuration
const axiosProxy = {
   protocol: 'http',
   host: proxyHost,
   port: proxyPort,
   auth: { username, password },
};

// Kirim request melalui proxy
// curl 'https://ip.oxylabs.io/location' -U 'user-aaaaaa_Hbohf-country-US:Bagusok55_Bagusok55' -x 'dc.oxylabs.io:8000'

// curl -i --proxy brd.superproxy.io:33335 --proxy-user brd-customer-hl_ac2f557a-zone-datacenter_proxy1:ycb99838gk66 "https://geo.brdtest.com/welcome.txt?product=dc&method=native"

(async () => {
   async function fetchData() {
      const start = performance.now(); // Mulai hitung waktu
      try {
         const response = await axios.post(
            'https://apis.gosizi.com/api/game-id-checker',
            {
               playerid: '294680977',
            },
            {
               proxy: axiosProxy,
               timeout: 10000,
               headers: {
                  Origin: 'https://gosizi.com',
                  referer: 'https://gosizi.com/',
               },
            }
         );

         const duration = performance.now() - start;
         console.log(`[OK] ${new Date().toISOString()} | Status: ${response.status} | Time: ${duration.toFixed(2)} ms`);
         console.log(response.data);
      } catch (err) {
         const duration = performance.now() - start;
         if (err.response) {
            console.error(
               `[ERR] ${new Date().toISOString()} | Status: ${err.response.status} | Time: ${duration.toFixed(2)} ms`
            );
            console.error(err.response.data);
         } else if (err.request) {
            console.error(`[ERR] ${new Date().toISOString()} | No response | Time: ${duration.toFixed(2)} ms`);
         } else {
            console.error(`[ERR] ${new Date().toISOString()} | ${err.message} | Time: ${duration.toFixed(2)} ms`);
         }
      }
   }

   // Fungsi untuk mengecek IP publik melalui proxy
   async function checkProxyIp() {
      const start = performance.now();
      try {
         // Ambil IP + lokasi menggunakan ipwho.is
         const response = await axios.get('https://ipwho.is/', {
            proxy: axiosProxy,
            timeout: 10000,
         });
         const duration = performance.now() - start;
         const d = response.data || {};
         if (d.success === false) {
            throw new Error(d.message || 'IP lookup failed');
         }
         const isp = d.connection?.isp || d.connection?.org || d.isp || '-';
         console.log(
            `[IP] ${new Date().toISOString()} | Time: ${duration.toFixed(2)} ms | IP: ${d.ip} | Country: ${
               d.country
            } | Region: ${d.region} | City: ${d.city} | ISP: ${isp}`
         );
      } catch (err) {
         const duration = performance.now() - start;
         if (err.response) {
            console.error(
               `[IP-ERR] ${new Date().toISOString()} | Status: ${err.response.status} | Time: ${duration.toFixed(2)} ms`
            );
            console.error(err.response.data);
         } else if (err.request) {
            console.error(`[IP-ERR] ${new Date().toISOString()} | No response | Time: ${duration.toFixed(2)} ms`);
         } else {
            console.error(`[IP-ERR] ${new Date().toISOString()} | ${err.message} | Time: ${duration.toFixed(2)} ms`);
         }

         // Fallback: minimal tampilkan IP saja via ipify
         try {
            const res2 = await axios.get('https://api.ipify.org?format=json', { proxy: axiosProxy, timeout: 7000 });
            console.log(`[IP] ${new Date().toISOString()} | IP: ${res2.data?.ip} | Location: -`);
         } catch (_) {
            // ignore
         }
      }
   }

   // Jalankan pengecekan IP sekali sebelum loop utama

   //    await fetchData();

   while (true) {
      await Promise.all([checkProxyIp(), fetchData()]);

      console.log('-');
   }
})();
