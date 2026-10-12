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

const gamekuServices = async (game, id = null, zone = null) => {
   try {
      const getIgn = await fetch(
         `https://pubg-check.vercel.app/api/game/${game.pathName}?${new URLSearchParams({
            id: id,
            zone: zone,
         })}`
      );

      const getIgnJson = await getIgn.json();
      if (getIgnJson.code == 200) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               user_id: id,
               username: getIgnJson.data.username,
               zone: zone,
               game: game.name,
            },
         };
      }

      return {
         code: 404,
         status: false,
         message: 'ID not found',
      };
   } catch (error) {
      console.log(error.message);
      return {
         code: 500,
         status: false,
         message: 'Internal Server Error',
      };
   }
};

module.exports = gamekuServices;
