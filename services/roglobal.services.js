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

const roGlobalServices = async (game, id = null, zone = null) => {
   const cekRo = await fetch(
      `
     https://roglobal.com/api/pay/game/server/roles?server_id=${zone}&open_id=${id}`,
      {
         headers: {
            Accept: '*/*',
            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
            Sign: '17c72c9d1d0898d0da6b1285983b74ee',
            Timestamp: '1687920476',
         },
      }
   );
   try {
      const cekRoResponse = await cekRo.json();

      if (cekRoResponse.code == 0) {
         if (cekRoResponse.data.list.length == 0) {
            return { code: 404, status: false, message: 'ID not found' };
         } else {
            return {
               code: 200,
               status: true,
               message: 'ID Found',
               data: {
                  username: cekRoResponse.data?.list[0]?.role_info,
                  user_id: id,
                  zone: game.dropdown.filter((item) => item.zoneId == zone)[0].name || null,
               },
            };
         }
      } else {
         return { code: 404, status: false, message: 'ID not found' };
      }
   } catch (err) {
      console.log(err);
      return { code: 500, status: false, message: 'Internal Server Error' };
   }
};

module.exports = roGlobalServices;
