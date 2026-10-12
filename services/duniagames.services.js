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

const duniaGamesServices = async (game, id = null, zone = null) => {
   const servername = game.dropdown?.length > 0 ? game.dropdown?.find((_zone) => _zone.zoneId == zone)?.name : null;
   console.log('Game:', game.name, '| ID:', id, '| Zone:', zone, '| Server Name:', servername);

   let payload = {
      productId: game.id,
      itemId: game.itemId,
      catalogId: game.catalogId,
      paymentId: game.paymentChannel,
      gameId: id,
      zoneId: zone || null,
      product_ref: game.product_ref,
      product_ref_denom: game.product_ref_denom,
      username: 'Agus11',
      serverName: servername,
      serverId: servername ? zone : null,
   };

   // console.log('Payload:', payload);

   const getUsernameGame = await fetch('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },

      body: JSON.stringify(payload),
   });

   try {
      const data = await getUsernameGame.json();
      // console.log('Response:', data);
      if (data.status.code == 0) {
         return {
            code: 200,
            status: true,
            message: 'ID Found',
            data: {
               username: data.data?.gameDetail?.userName,
               user_id: id,
               zone: zone || null,
            },
         };
      } else {
         return { code: 404, status: false, message: data.status?.message || 'ID Tidak ditemukan' };
      }
   } catch (err) {
      return { code: 500, status: false, message: 'Internal Server Error' };
   }
};

module.exports = duniaGamesServices;
