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

const fs = require('fs');
const fetch = require('node-fetch');
const _ = require('lodash');

(async () => {
   const response = await fetch(
      'https://api.duniagames.co.id/api/product/v2/product?productType=all&page=1&limit=1000&productPage='
   );
   const data = await response.json();
   const newData = data.data.data.map((item) => {
      return {
         id: item.id,
         name: item.gameName,
         slug: item.slug,
         provider: 'duniagames',
      };
   });

   const a = _.orderBy(newData, ['name'], ['asc']);

   let datas = [];

   let abc = async () => {
      for (let i = 0; i < a.length; i++) {
         const response = await fetch(
            `https://api.duniagames.co.id/api/product/v1/product/${a[i].slug}?include=item&includeFaq=true`
         );
         const data = await response.json();
         const getCatalog = await fetch(
            `https://api.duniagames.co.id/api/product/v1/payment-channel/?criteriaId=2&itemId=${data.data?.item?.data[0]?.id}`
         );
         const catalog = await getCatalog.json();

         const dropdown = [
            ...data.data?.serverIdOptions?.map((item) => {
               return {
                  zoneId: item.optionValue,
                  name: item.optionText,
               };
            }),
         ];

         console.log(a[i].name);
         datas.push({
            ...a[i],
            slug: a[i].slug + '-dg',
            name: a[i].name?.replaceAll('Top Up', '') + ' (DG)',
            isZone:
               data.data?.isZoneId == 0 && data.data?.serverIdOptions
                  ? true
                  : !data.data?.serverIdOptions && data.data?.isZoneId == 1
                  ? true
                  : false,
            dropdown: dropdown.length > 0 ? dropdown : null,
            itemId: data.data?.item?.data[0]?.id,
            product_ref_denom: data.data?.item?.data[0]?.product_ref_denom,
            product_ref: data.data?.product_ref,
            catalogId: catalog.data?.catalogId || null,
            paymentChannel: catalog.data?.paymentChannel[0]?.id,
         });
         //  console.log(data);
      }
   };

   await abc();
   fs.writeFile('./utils/data/duniagames.json', JSON.stringify({ data: datas }, null, 2), 'utf8', function (err) {
      if (err) {
         console.log('An error occured while writing JSON Object to File.');
         return console.log(err);
      }

      console.log('JSON file has been saved.');
   });
})();
