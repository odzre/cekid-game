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

const tamiChatServices = async (game, id = null, zone = null) => {
   try {
      const response = await axios.post(
         `https://popojk.gchao.com/faceshow/web/h5/getUserById?param=${encodeURIComponent(
            JSON.stringify({ userId: id })
         )}`
      );

      if (response.data?.code === 1) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: response.data?.result.nickName || null,
               user_id: response.data?.result.userId,
               show_uid: id,
               zone: zone || null,
               game: game.name,
               avatar: response.data?.result.img || null,
               region: response.data?.result.phoneCountry || null,
            },
         };
      } else {
         return { code: 404, status: false, message: 'ID not found' };
      }
   } catch (err) {
      console.log(err);
      return { code: 500, status: false, message: 'Internal Server Error, please contact admin' };
   }
};

module.exports = tamiChatServices;
