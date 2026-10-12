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

const azalLiveServices = async (game, id = null, zone = null) => {
   try {
      const response = await axios.get(`https://union-api.azallivegroup.com/api/payment/searchUser?uid=${id}`, {
         headers: {
            'User-Agent':
               'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            Accept: 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            appversionname: '2.99.99.99',
            language: 'en',
            whetherjs: '1',
            'sec-ch-ua-platform': '"Windows"',
            // apisign: 'q-sign-time=1754030625;1754031525&q-signature=fd5e3ef0021164952cb689203c580486633517e9',
            'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            'sec-ch-ua-mobile': '?0',
            deviceid: crypto.randomUUID(),
            apppackage: 'com.hk.azal.live',
            channel: 'web',
            dnt: '1',
            devicemodel: 'default',
            origin: 'https://azallivegroup.com',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            referer: 'https://azallivegroup.com/',
            'accept-language': 'en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7',
            priority: 'u=1, i',
         },
      });
      console.log(response.data);

      if (response.data?.data?.uid) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: response.data?.data.nickName || null,
               user_id: response.data?.data.uid,
               show_uid: id,
               zone: zone || null,
               game: game.name,
               avatar: response.data?.data.avatar || null,
               verify_phone: response.data?.data.verifyPhone || null,
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

module.exports = azalLiveServices;
