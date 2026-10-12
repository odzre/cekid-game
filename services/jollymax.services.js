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

const jollymaxServices = async (game, id = null, zone = null) => {
   const checkServerName = game?.dropdown?.find((x) => x.id == id);
   const payload = {
      token: 'b1cef8b7d21b44ac91e978bc3be0afbb',
      jmsId: '',
      appId: game.appId,
      roleName: '',
      country: 'id',
      language: 'id',
      appAlias: game.appAlias,
      platformName: '',
      serverId: zone || '',
      goodsId: game.goodsId,
      payTypeId: game?.payTypeId || 441390,
      userId: id,
      activityId: '',
      serverName: checkServerName?.name || '',
      domain: 'www.jollymax.com',
   };

   const checkJolly = await fetch(`https://topup-center.shoplay365.com/shareit-topup-center/order/check-uid`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
   });

   try {
      const checkJollyJson = await checkJolly.json();
      // console.log(checkJollyJson);

      if (checkJollyJson.code == '200' && checkJollyJson.data.isValid == 1) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: { user_id: id, username: checkJollyJson.data?.nickName || '', zone: zone || '' },
         };
      } else if (checkJollyJson.code == '200' && checkJollyJson.data.isValid == 1) {
         return { code: 200, status: true, message: 'Silahkan coba lagi' };
      } else {
         return { code: 404, status: false, message: 'ID not found' };
      }
   } catch (e) {
      return { code: 500, status: false, message: 'Error Server' };
   }
};

module.exports = jollymaxServices;
