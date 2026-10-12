/* 
   Gunakan file ini untuk konfigurasi
   Jika ingin menggunakan license key, ubah useLicense menjadi true
   Jika ingin menggunakan higsDomino, ubah higsDomino menjadi true (gatau higgs domino masih work atau ga, coba aja)
   Jika ingin menggunakan rate limiter, ubah useRateLimiter menjadi true
*/

const config = {
   higsDomino: false,
   useLicense: false,
   useRateLimiter: false,
   rateLimiter: {
      maxRequests: 6, // max requests per time
      seconds: 120, //2 minute in milliseconds
   },
};

module.exports = config;
