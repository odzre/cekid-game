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

const fetch = require('node-fetch');

const statsRoyaleService = async (game, id = null, zone = null) => {
   const checkStats = await fetch(
      `https://stats-royale-api-js-beta-z2msk5bu3q-uk.a.run.app/profile/${id.replace('#', '')}`
   );
   try {
      const checkStatsResponse = await checkStats.json();
      // console.log(checkStatsResponse);
      if (checkStatsResponse.success == true) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: checkStatsResponse.profile?.name,
               user_id: id,
               zone: zone || null,
               level: checkStatsResponse.profile?.level,
               throphies: checkStatsResponse.profile?.trophies,
            },
         };
      } else {
         return { code: 404, status: false, message: 'ID not found' };
      }
   } catch (err) {
      console.log(err);
      return { code: 500, status: false, message: 'Internal Server Error' };
   }
};

module.exports = statsRoyaleService;
