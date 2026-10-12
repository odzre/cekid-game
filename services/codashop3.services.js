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

const crypto = require('crypto');
const axios = require('axios');
const formatedDate = require('../utils/formatedDate.js');
const { generateRandomEmail } = require('../utils/random-email.js');
const { error } = require('console');

const codashop3Services = async (game, id, zone = null) => {
   const email = generateRandomEmail();

   const data = new URLSearchParams({
      'user.userId': id,
      'user.zoneId': zone,
      'voucherPricePoint.id': game.priceId,
      'voucherPricePoint.price': game.price,
      'voucherPricePoint.variablePrice': '0',
      absoluteUrl: `https://www.codashop.com/id-id/${game.slug}`,
      affiliateTrackingId: '',
      anonymousId: '',
      checkoutId: crypto.randomUUID(),
      clevertapId: '',
      deviceId: crypto.randomUUID(),
      email: email,
      exUserInfo: '',
      gvtId: game.gvtId,
      isReferredUser: 'false',
      isRiskCheckingEnabled: 'false',
      lvtId: game.lvtId,
      msisdn: '',
      pcId: game.pcId,
      shopLang: 'id_ID',
      userCustomCommerceEmailConsent: 'false',
      userEmailConsent: 'false',
      userMarketingConsent: 'false',
      userMobileConsent: 'false',
      userSessionId: btoa(email),
      userValidationResult: '',
      userVariablePrice: '0',
      utmParameters: '',
      voucherTypeId: game.voucherTypeId,
      voucherTypeName: game.voucherTypeName,
   });

   // console.log(data);

   const getUsernameGame = await axios.post('https://order-sg.codashop.com/initPayment.action', data, {
      headers: {
         'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
         Accept: 'application/json, text/plain, */*',
         'Accept-Encoding': 'gzip, deflate, br, zstd',
         'accept-language': 'id-id',
         'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
         origin: 'https://www.codashop.com',
         referer: 'https://www.codashop.com/',
      },
   });

   try {
      const getUsernameGameResponse = getUsernameGame.data;
      console.log('getUsernameGameResponse', getUsernameGameResponse, game);
      // console.log('getUsernameGameResponse', getUsernameGameResponse?.confirmationFields?.roles);
      if (getUsernameGameResponse.RESULT_CODE && getUsernameGameResponse.RESULT_CODE == 10001)
         return { code: 400, status: false, message: 'Silahkan Coba 5 detik lagi' };
      if (getUsernameGameResponse.success) {
         if (getUsernameGameResponse.result == '') return { code: 404, status: false, message: 'ID not found' };
         const result = decodeURIComponent(getUsernameGameResponse.result) || {};
         const newResult = JSON.parse(result) || {};

         const username =
            newResult?.username ||
            getUsernameGameResponse?.confirmationFields?.playerName ||
            getUsernameGameResponse?.confirmationFields?.roles[0]?.role ||
            null;

         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: decodeURI(username),
               user_id: id,
               zone: zone || null,
            },
         };
      }

      return {
         code: 200,
         status: false,
         message: getUsernameGameResponse.errorMsg || 'Error, Please contact admin',
         error: getUsernameGameResponse.RESULT_CODE,
      };
   } catch (err) {
      console.log(err);
      return { code: 500, status: false, message: 'Internal Server Error', error: err };
   }
};

module.exports = codashop3Services;
