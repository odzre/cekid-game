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

const { random } = require('lodash');
const fetch = require('node-fetch');

const topupLiveServices = async (game, id = null, zone = null) => {
   const opt = {
      charge_region: zone,
      role_name: random(1000000, 9999999).toString(),
   };

   const getUsername = await fetch(`https://www.topuplive.com/pro-api/charge/account-check`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         type: game.type,
         sku_id: game.skuId,
         charge_tpl: {
            charge_account: id,
            ...opt,
         },
         charge_account: id,
      }),
   });

   try {
      const getUsernameJson = await getUsername.json();

      console.log(getUsernameJson);

      if (getUsernameJson.status != 1) {
         return {
            code: 404,
            status: false,
            message: getUsernameJson.message,
         };
      } else if (getUsernameJson.status == 1 && getUsernameJson.data.check) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               user_id: id,
               username: getUsernameJson.data.title,
               zone: zone,
            },
         };
      } else {
         return {
            code: 404,
            status: false,
            message: 'ID not found atau kebanned',
         };
      }
   } catch (err) {
      console.log(err);
      return {
         code: 500,
         status: false,
         message: 'Internal Server Error',
      };
   }
};

module.exports = topupLiveServices;
