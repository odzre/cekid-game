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

const brawlStarService = async (game, id = null, zone = null) => {
   const input = JSON.stringify({ json: id.replace('#', '') });

   const checkStats = await fetch(`https://brawltime.ninja/api/player.byTag?input=${encodeURIComponent(input)}`);
   try {
      console.log(await checkStats.text());
      const checkStatsResponse = await checkStats.json();
      if (checkStatsResponse?.result?.data?.json?.name) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: checkStatsResponse.result.data.json.name,
               user_id: id,
               zone: zone || null,
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

module.exports = brawlStarService;
