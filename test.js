const axios = require('axios');
const qs = require('qs');

(async () => {
   let data = qs.stringify({
      n: '8/1/2025-1917',
      'order.data.profile': 'eyJuYW1lIjoiIiwiZGF0ZW9mYmlydGgiOiIiLCJpZF9ubyI6IiJ9',
      'user.userId': '1',
      'user.zoneId': '',
      'voucherPricePoint.id': '205648',
      'voucherPricePoint.price': '34000',
      'voucherPricePoint.variablePrice': '0',
      absoluteUrl: 'https://www.codashop.com/id-id/8-ball-pool',
      affiliateTrackingId: '',
      anonymousId: '',
      checkoutId: '46c09561-08ef-4da1-bdb7-fe0f06df8e1a',
      clevertapId: '',
      deviceId: '9af156a1-612f-4e69-8e39-9dbd0f8d5013',
      email: '',
      exUserInfo: '',
      gvtId: '250',
      isReferredUser: 'false',
      isRiskCheckingEnabled: 'false',
      //   lvtId: '2772',
      msisdn: '',
      pcId: '227',
      shopLang: 'id_ID',
      userCustomCommerceEmailConsent: 'false',
      userEmailConsent: 'false',
      userMarketingConsent: 'false',
      userMobileConsent: 'false',
      userSessionId: '0e7547f1-c70d-45fe-bb5a-70bc35463d02',
      userValidationResult: '',
      userVariablePrice: '0',
      utmParameters: '',
      voucherTypeId: '198',
      voucherTypeName: 'EIGHT_BALL_POOL',
      //   pricingEngineToken:
      //      'zK3cuIsO4c7GA6T3#5rX5eiIolu4uFqBJZkVShp8RXpM2ZHHkc99EVXNd4xQqt50t9VAA5x4fd8G2vbWpDrtCCym6gQOI2NXW2JmICN2rz+sKJL7ddj7rRmOToyosXT4g09+qJtd0QUimvdJd3V4SGM5kwGroORaMwJnuX9DF/UpPg/HiBAE52tnK2ZFwss41hCDPwW1x/rhAk0a6JKAdjtHXn95oC8paVXDEDEEbSDgiJjTnxu2pJiPP5jKaiy983h5NXMxINL1Q6WI3zwAjXtyb7N/5tUXXKZV0Xocdtq286d6TuveOXHVxDQHbKNgwVYqiflk3vwGAQ3dhScUMANtE7zOR5X9qxkiuF9mFUDW3aLj/OYrYxZGCTaa2pFj5Phrpj3CIHA+KZfPVyVEm0iF5ppOLbtysjHfpLnK/7mXiUWNs2mHEFsoUmRPRUZ8PIQDvPgnegXZA9AgFwWsr7GG1geBPUvLiFXu5fA3SRJYjx50p7y2RKJNn6BBUeuCQXIQg3+e1TUzZTwZPvnbiE3VDE+S2ECx2dQv1lgdZzMpFgrhJll47Kciy/QHAkHg/a7s02x1BuT1PgY/xU7uPfSqhXJAx4+fyQWWIoUqU1fEkE35Kt6hfIaktOC1M7pkiQ9kN0+5FIfgH1ibo9aFn5B2mwVGk/7UXn8S8c21JQ20tKuQvWEqpk6zwrhW5kN+Iy6aKJyD/HM42Iu3kivmF2CafbRrpCHUOpTOd7tA3xhsMUJVRNVOYJTmIlE+dVyVq7cw2rzDScLVEmx6R/a3VNj/3BJOLHT1iDI/TIXCNXwFgVkoQfa2TrtPpFhN6x4LJ7hU9Eig8dTJRUDzKDnT6UTuLxAHcPxRp4ICs07WnuezbwiyALtVIAnjhwzMZHv+608i8',
   });

   let config = {
      method: 'POST',
      url: 'https://order-sg.codashop.com/initPayment.action',
      headers: {
         'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
         Accept: 'application/json, text/plain, */*',
         'Accept-Encoding': 'gzip, deflate, br, zstd',
         'accept-language': 'id-id',
         'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
         origin: 'https://www.codashop.com',
         referer: 'https://www.codashop.com/',
         'x-session-country2name': 'ID',
      },
      data: data,
   };

   try {
      axios
         .request(config)
         .then((response) => console.log(response))
         .catch((error) => console.log('error', error));
   } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
   }
})();
