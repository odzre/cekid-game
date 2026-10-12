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

const bosBosGameService = async (game, id = null, zone = null) => {
   const cekBosBos = await fetch(`https://www.lmevq.com/web/infullRequest.do`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
         Origin: 'https://www.lmevq.com',
         Referer: 'https://www.lmevq.com/web/webInfull.do',
      },
      body: new URLSearchParams({
         userId: id,
         costKey: game.costKey,
         infullType: game.infullType,
         version: '',
      }),
   });

   try {
      const cekBosBosJson = await cekBosBos.json();
      if (cekBosBosJson.code == '0') {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: cekBosBosJson.message.nickName,
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

module.exports = bosBosGameService;
