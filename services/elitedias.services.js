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

const { default: axios } = require('axios');

const elitediasServices = async (game, id = null, zone = null) => {
   let filteredZone = zone ? game?.dropdown.filter((a) => zone == a.zoneId) : null;
   const checkElite = await fetch('https://api.elitedias.com/checkid', {
      method: 'POST',
      // crendentials: 'include',
      headers: {
         Accept: '*/*',
         'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
         // 'X-Reqquested-WIth': 'XMLHttpRequest',
         // Referer: 'https://elitedias.com/',
         // Origin: 'https://elitedias.com',
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         game: game.game,
         userid: id,
         serverid: filteredZone ? filteredZone[0]?.name : null,
      }),
   });

   console.log(
      JSON.stringify({
         game: game.game,
         userid: id,
         serverid: filteredZone ? filteredZone[0]?.name : null,
      })
   );

   try {
      const checkEliteJson = await checkElite.json();

      let region = checkEliteJson.region ? { region: checkEliteJson.region } : {};

      if (checkEliteJson.valid == 'valid') {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               user_id: id,
               username: checkEliteJson.name,
               zone: zone,
               ...region,
            },
         };
      } else {
         return {
            code: 404,
            status: false,
            message: 'ID not found',
         };
      }
   } catch (e) {
      console.log(e.message);
      return {
         code: 500,
         status: false,
         message: 'Internal Server Error, Silahkan coba lagi nanti',
      };
   }
};

module.exports = elitediasServices;
