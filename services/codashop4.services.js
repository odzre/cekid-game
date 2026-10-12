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
const qs = require('qs');

const codashop4Services = async (game, id, zone = null) => {
   const email = generateRandomEmail();

   // console.log(data);

   try {
      // Get Product Info
      // Check ID GAME
      let availableSkus = [];
      let pageLockToken = '';
      let sellerId = '';
      const a = {
         sessionId: Date.now(),
         sessionNum: 1,
         ip: '114.10.155.55',
         codaCookieId: crypto.randomUUID(),
         deviceId: crypto.randomUUID(),
         checkoutId: crypto.randomUUID(),
      };

      const expContext = {
         ns: 'codashop',
         fullUrl: `https://www.codashop.com/id-id/${game.slug}`,
         libraryVersion: '0.49.0',
         domainName: 'www.codashop.com',
         userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
         os: 'Windows 10',
         mobile: false,
         browser: 'Chromium:140/Not=A?Brand:24/Google Chrome:140',
         sessionId: a.sessionId,
         sessionNum: a.sessionNum,
         engagementMs: 1279895,
         ip: a.ip,
         codaCookieId: a.codaCookieId,
         deviceId: a.deviceId,
         userType: 1,
         loginStatus: 0,
         platformId: 1,
         url: `https://www.codashop.com/id-id/${game.slug}`,
         userCountry: 'ID',
         vue3ExperimentVariation: 'globalAccelerator',
         whiteLabelId: null,
         country: 'ID',
         appVersion: 'vue3',
         pageTypeName: 'ProductDetail',
         gvtId: game.gvtId,
         lvtId: '',
         checkoutId: a.checkoutId,
         lastUsedPcId: null,
         emailSaved: false,
      };

      const productInfo = await axios.post(
         `https://shopapi.codashop.com/productPage`,
         {
            productPath: `/id/${game.slug}`,
            locale: 'id-id',
            whitelabelId: 0,
         },
         {
            headers: {
               'x-session-country2name': 'ID',
               'x-session-key': '',
               'x-whitelabel-id': 0,
               'x-xsrf-token': '',
               'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
               Accept: 'application/json, text/plain, */*',
               'x-expt-context': JSON.stringify(expContext),
            },
         }
      );

      if (game.isDynamic) {
         // console.log('Fetching dynamic SKU info for game:', game.slug);
         const getDynamicProduct = await axios.post(
            'https://shopapi.codashop.com/productPage/dynamicSkuInfo',
            {
               deviceId: crypto.randomUUID(),
               whitelabelId: 0,
               userId: id,
               serverId: zone || '',
               characterId: '',
               worldId: '',
               locale: 'id-id',
               productPath: `/id/${game.slug}`,
            },
            {
               headers: {
                  'x-session-country2name': 'ID',
                  'x-session-key': '',
                  'x-whitelabel-id': 0,
                  'x-xsrf-token': '',
                  'User-Agent':
                     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                  Accept: 'application/json, text/plain, */*',
                  'x-expt-context': JSON.stringify(expContext),
               },
            }
         );

         availableSkus = getDynamicProduct.data.skus || [];
         pageLockToken = getDynamicProduct.data.pageLockToken || '';
         sellerId = getDynamicProduct.data.sellerId || '';
      } else {
         availableSkus = productInfo.data.skus || [];
         pageLockToken = productInfo.data.pageLockToken || '';
         sellerId = productInfo.data.sellerId || '';
      }

      // Select SKU with price > 15000

      const selectedSku = availableSkus.find((sku) => {
         const skuPrice = sku.pricing?.skuPrices?.price || 0;
         return skuPrice > 15000;
      });

      if (!selectedSku) {
         return { code: 404, status: false, message: 'No SKU found with price > 15000' };
      }

      // Select payment method with isMno = false and channelStatus = "ACTIVE"
      const availablePaymentChannels = productInfo.data.paymentChannels || [];
      const selectedPaymentChannel = availablePaymentChannels.find((channel) => {
         return channel.isMno === false;
      });

      if (!selectedPaymentChannel) {
         return { code: 404, status: false, message: 'No suitable payment channel found' };
      }

      // Get the pricing token for selected payment channel from selected SKU
      const paymentChannelPrices = selectedSku.pricing?.paymentChannelPrices || {};
      const selectedPaymentPrice = paymentChannelPrices[selectedPaymentChannel.id];

      if (!selectedPaymentPrice) {
         return { code: 404, status: false, message: 'Payment channel not available for selected SKU' };
      }

      const createOrderToken = await axios.post('https://shopapi.codashop.com/productPage/createOrderToken', {
         pageLockToken: pageLockToken,
         productPath: `/id/${game.slug}`,
         skuId: selectedSku.Id,
         paymentChannelId: selectedPaymentChannel.id,
         whitelabelId: 0,
      });

      try {
         // const data = qs.stringify({
         //    'user.userId': id,
         //    'user.zoneId': zone || '',
         //    'voucherPricePoint.id': selectedPaymentPrice.id,
         //    'voucherPricePoint.price': selectedPaymentPrice.price,
         //    'voucherPricePoint.variablePrice': '0',
         //    absoluteUrl: `https://www.codashop.com/id-id/${game.slug}`,
         //    affiliateTrackingId: '',
         //    anonymousId: '',
         //    checkoutId: a.checkoutId,
         //    clevertapId: '',
         //    deviceId: a.deviceId,
         //    email: email,
         //    exUserInfo: '',
         //    gvtId: game.gvtId,
         //    isReferredUser: 'false',
         //    isRiskCheckingEnabled: 'false',
         //    lvtId: sellerId,
         //    msisdn: '6285155060743',
         //    pcId: selectedPaymentPrice.paymentChannelId,
         //    shopLang: 'id_ID',
         //    userCustomCommerceEmailConsent: 'false',
         //    userEmailConsent: 'false',
         //    userMarketingConsent: 'false',
         //    userMobileConsent: 'false',
         //    userSessionId: crypto.randomUUID(),
         //    userValidationResult: '',
         //    userVariablePrice: '0',
         //    utmParameters: '',
         //    voucherTypeId: selectedSku.Id,
         //    voucherTypeName: selectedSku.SkuTitle,
         //    dynamicSkuToken: createOrderToken.data.dynamicSkuToken || '',
         //    pricePointDynamicSkuToken: createOrderToken.data.pricePointToken || '',
         //    pricingEngineToken: createOrderToken.data.pricingEngineToken,
         // });

         const data = qs.stringify({
            n: '9/27/2025-935',
            'order.data.profile': 'eyJuYW1lIjoiIiwiZGF0ZW9mYmlydGgiOiIiLCJpZF9ubyI6IiJ9',
            'user.userId': id,
            'user.zoneId': zone || '',
            'voucherPricePoint.id': selectedPaymentPrice.id,
            'voucherPricePoint.price': selectedPaymentPrice.price,
            'voucherPricePoint.variablePrice': '0',
            absoluteUrl: `https://www.codashop.com/id-id/${game.slug}`,
            affiliateTrackingId: '',
            anonymousId: '',
            checkoutId: a.checkoutId,
            clevertapId: '',
            deviceId: a.deviceId,
            email: email,
            exUserInfo: zone || '',
            gvtId: game.gvtId,
            isReferredUser: 'false',
            isRiskCheckingEnabled: 'false',
            lvtId: sellerId ?? 50,
            msisdn: '',
            pcId: selectedPaymentPrice.paymentChannelId,
            shopLang: 'id_ID',
            userCustomCommerceEmailConsent: 'false',
            userEmailConsent: 'false',
            userMarketingConsent: 'false',
            userMobileConsent: 'false',
            userSessionId: crypto.randomUUID(),
            userValidationResult: '',
            userVariablePrice: '0',
            utmParameters: '',
            voucherTypeId: productInfo.data.productInfo.voucherTypeId || selectedSku.Id,
            voucherTypeName: productInfo.data.productInfo.voucherTypeName || selectedSku.SkuTitle,
            dynamicSkuToken: createOrderToken.data.dynamicSkuToken || '',
            pricePointDynamicSkuToken: createOrderToken.data.pricePointToken || '',
            worldId: '',
            gcName: '',
            pricingEngineToken: createOrderToken.data.pricingEngineToken || '',
         });

         // console.log('data', qs.parse(data));

         const getUsernameGame = await axios.post('https://order-sg.codashop.com/initPayment.action', data, {
            headers: {
               'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
               Accept: 'application/json, text/plain, */*',
               'Accept-Encoding': 'gzip, deflate, br, zstd',
               'accept-language': 'id-id',
               'content-type': 'application/x-www-form-urlencoded',
               origin: 'https://www.codashop.com',
               referer: 'https://www.codashop.com/',
               'x-session-country2name': 'ID',
            },
         });

         const getUsernameGameResponse = getUsernameGame.data;
         console.log('getUsernameGameResponse', getUsernameGameResponse);
         // console.log('Selected SKU:', selectedSku.SkuTitle, 'Price:', selectedPaymentPrice.price);
         // console.log('Selected Payment Channel:', selectedPaymentChannel.name || selectedPaymentChannel.id);
         // console.log('getUsernameGameResponse', getUsernameGameResponse?.confirmationFields?.roles);
         if (getUsernameGameResponse.RESULT_CODE && getUsernameGameResponse.RESULT_CODE == 10001)
            return { code: 400, status: false, message: 'Silahkan Coba 5 detik lagi' };
         if (getUsernameGameResponse.success) {
            if (getUsernameGameResponse.result == '')
               return { code: 404, status: false, message: getUsernameGameResponse?.errorMsg || 'ID not founds' };
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
            code: 400,
            status: false,
            message: getUsernameGameResponse.errorMsg || 'Error, Please contact admin',
            error: getUsernameGameResponse.RESULT_CODE,
         };
      } catch (err) {
         if (axios.isAxiosError(err)) {
            return { code: 500, status: false, message: 'Internal Server Error', error: err.message };
         } else {
            console.error(`Unexpected error for game ${game.slug}:`, err);
            return { code: 500, status: false, message: 'Internal Server Error', error: err };
         }
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         console.error(`Error fetching data for game ${game.slug}:`, error.message);
         return { code: 500, status: false, message: 'Internal Server Error', error: error.message };
      } else {
         console.error(`Unexpected error for game ${game.slug}:`, error);
         return { code: 500, status: false, message: 'Internal Server Error', error: error };
      }
   }
};

module.exports = codashop4Services;
