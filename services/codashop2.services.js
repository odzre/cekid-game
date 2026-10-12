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

const axios = require('axios');
const crypto = require('crypto');

const codashop2Service = async (game, id = null, zone = null) => {
   try {
      const cekCoda = await axios.post(
         `https://order-sg.codashop.com/validate`,
         {
            country: 'id',
            voucherTypeName: game.voucherTypeName,
            whiteLabelId: '',
            deviceId: crypto.randomUUID(),
            userId: id,
            zoneId: zone,
         },
         {
            headers: {
               Origin: 'https://www.codashop.com',
            },
         }
      );

      // console.log(cekCoda);

      if (cekCoda.data && (cekCoda.data?.success || cekCoda.data?.result)) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: decodeURIComponent(cekCoda.data?.result?.username),
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

module.exports = codashop2Service;
