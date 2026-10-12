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

const mlRegionCheck = async (game, id, zone) => {
   try {
      const response = await axios.post(
         `https://gopay.co.id/games/v1/order/user-account`,
         {
            code: game.code,
            data: {
               userId: id,
               zoneId: zone,
            },
         },
         {
            headers: {
               'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
               'X-Captcha-Token': '',
               'X-Client': 'web-desktop',
               'X-Timestamp': Date.now().toString(),
            },
         }
      );

      if (response.data?.data) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: response.data?.data?.username || null,
               user_id: id,
               show_uid: id,
               zone: zone || null,
               game: game.name,
               region: response.data?.data?.countryOrigin?.toUpperCase() || null,
            },
         };
      } else {
         return { code: 404, status: false, message: 'ID not found' };
      }
   } catch (err) {
      if (axios.isAxiosError(err)) {
         return {
            code: err.response?.status || 500,
            status: false,
            message: err.response?.data?.message || 'Error occurred',
         };
      }
      return { code: 500, status: false, message: 'Internal Server Error, please contact admin' };
   }
};

const gopayGamesServices = async (game, id = null, zone = null) => {
   try {
      console.log(`Checking Gopay Games ID: ${id} for game: ${game.code}`);

      if (game.code === 'MOBILE_LEGENDS') {
         return await mlRegionCheck(game, id, zone);
      }

      const response = await axios.get(
         `https://gopay.co.id/games/v1/order/prepare/${game.code}?userId=${id}&zoneId=${zone}`,
         {
            headers: {
               'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
               'X-Captcha-Token': '',
               'X-Client': 'web-desktop',
               'X-Timestamp': Date.now().toString(),
            },
         }
      );

      if (response.data?.data) {
         console.log(response.data);
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: response.data?.data || null,
               user_id: id,
               show_uid: id,
               zone: zone || null,
               game: game.name,
            },
         };
      } else {
         return { code: 404, status: false, message: 'ID not found' };
      }
   } catch (err) {
      if (axios.isAxiosError(err)) {
         return {
            code: err.response?.status || 500,
            status: false,
            message: err.response?.data?.message || 'Error occurred',
         };
      }
      return { code: 500, status: false, message: 'Internal Server Error, please contact admin' };
   }
};

module.exports = gopayGamesServices;
