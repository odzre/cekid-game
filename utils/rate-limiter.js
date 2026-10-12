/*
  ------------------------------------------------------------------------
  Hak Cipta © 2025 oleh [Nama Kamu]

  Skrip ini adalah karya orisinal yang dibuat oleh [Nama Kamu]. 
  Semua hak dilindungi undang-undang. Dilarang keras untuk menyalin, 
  mendistribusikan, memodifikasi, atau memperjualbelikan sebagian maupun 
  seluruh kode ini tanpa izin tertulis dari pemilik.

  Skrip ini dibuat untuk tujuan tertentu sesuai dengan visi dan misi 
  pengembang, dan setiap penggunaan di luar dari yang dimaksudkan 
  harus mendapatkan persetujuan resmi.

  Dengan menggunakan kode ini tanpa izin, Anda setuju bertanggung jawab 
  atas segala konsekuensi hukum yang mungkin timbul.

  Hormatilah karya dan usaha pengembang dengan tidak melakukan tindakan 
  plagiarisme atau pelanggaran hak cipta.

  Terima kasih telah menghargai hasil karya ini.

  Kontak untuk izin atau kolaborasi:
  Email: kamu@emailmu.com
  Website: https://websitemu.com
  ------------------------------------------------------------------------
*/

const redis = require('./redis.js');

const rateLimiter = (rule) => {
   const { endpoint, rate } = rule;

   return async (req, res, next) => {
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const redisId = `${endpoint}:${ipAddress}`;

      console.log('ip redis', ipAddress);

      const request = await redis.incr(redisId);

      if (request === 1) {
         await redis.expire(redisId, rate.time);
      }

      if (request > rate.limit) {
         return res.status(200).json({
            code: 200,
            status: true,
            message:
               'Request Limit 2 menit sekali, silahkan coba lagi nanti. Beli script asli hanya https://www.facebook.com/rizqibagus.andrean',
            data: {
               username: 'Beli script yang asli hanya di fb https://www.facebook.com/rizqibagus.andrean',
               user_id:
                  'Limit Bang tunggu 2 menit, kebanyakan request, beli script asli hanya https://www.facebook.com/rizqibagus.andrean biar bisa no limit',
               zone: 'Limit Bang, kebanyakan request, beli script asli hanya https://www.facebook.com/rizqibagus.andrean',
               region:
                  'Limit Bang, kebanyakan request, beli script asli hanya https://www.facebook.com/rizqibagus.andrean',
            },
            // ip: ipAddress,
         });
      }

      next();
   };
};

module.exports = rateLimiter;
