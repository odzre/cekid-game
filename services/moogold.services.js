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

const moogoldService = async (game, id = null, zone = null) => {
   try {
      const data = new URLSearchParams({
         attribute_amount: game.attributeAmount,
         'text-5f6f144f8ffee': id,
         'text-1601115253775': zone,
         quantity: game.quantity,
         'add-to-cart': game.addToCart,
         product_id: game.productId,
         variation_id: game.variationId,
      });

      const response = await axios.post(
         'https://moogold.com/wp-content/plugins/id-validation-new/id-validation-ajax.php',
         data,
         {
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
               origin: 'https://moogold.com',
               referer: 'https://moogold.com/product/mobile-legends/',
            },
         }
      );
      if (response.data) {
         // console.log(response.data);

         if (response.data?.message?.length > 0) {
            const parsedData = parseStringToJson(response.data.message);

            // console.log(parsedData);

            return {
               code: 200,
               status: true,
               message: 'ID Found',
               data: {
                  username: parsedData['in-gamenickname'] ?? null,
                  user_id: id,
                  zone: zone || null,
                  region: parsedData['country'] ?? null,
               },
            };
         } else {
            return { code: 404, status: false, message: 'ID not found' };
         }
      } else {
         return { code: 404, status: false, message: 'ID not found' };
      }
   } catch (err) {
      console.log(err);
      return { code: 500, status: false, message: 'Internal Server Error' };
   }
};

function parseStringToJson(input) {
   const regex = /^(.*?):\s*(.*?)$/gm;
   const result = {};
   let match;

   while ((match = regex.exec(input)) !== null) {
      let key = match[1].toLowerCase().replace(/\s+/g, '');
      let value = match[2].trim();

      if (key === 'userid' || key === 'serverid') {
         value = parseInt(value, 10);
      }

      result[key] = value;
   }

   return result;
}

module.exports = moogoldService;
