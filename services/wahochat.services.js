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

// https://recharge.waho.live/

const axios = require('axios');

const wahoChatServices = async (game, id = null, zone = null) => {
   try {
      const response = await axios.get(`https://pay.linktoanywhere.net/pay_center/waho/user?rid=${id}`);

      if (response.data?.code === 0) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: response.data?.data.name || null,
               user_id: response.data?.data.uid,
               show_uid: response.data?.data.strRid,
               rid: response.data?.data.rid,
               zone: zone || null,
               game: game.name,
               avatar: response.data?.data.head || null,
               region: response.data?.data.countryCode || null,
            },
         };
      } else {
         return { code: 404, status: false, message: response.data?.msg || 'ID not found' };
      }
   } catch (err) {
      console.log(err);
      return { code: 500, status: false, message: 'Internal Server Error, please contact admin' };
   }
};

module.exports = wahoChatServices;
