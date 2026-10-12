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
const axios = require('axios');
const crypto = require('crypto');

const headers = {
   Origin: 'https://duniagames.co.id',
   Referer: 'https://duniagames.co.id/',
   'X-Device': crypto.randomUUID(),
   Channel: 'web',
   'ciam-type': 'FR',
   'device-brand': 'web',
   'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
};

(async () => {
   const response = await fetch(
      'https://api.duniagames.co.id/api/product/v2/product?productType=all&page=1&limit=1000&productPage='
   );
   const data = await response.json();
   const newData = data.data.data
      .filter((item) => item.isActive && !item.isMaintenance && item.productType === 'non-telco')
      .map((item) => ({
         id: item.id,
         name: item.name,
         slug: item.slug ?? 'not-found',
         provider: 'duniagames',
         product_ref: item.product_ref,
      }));

   console.log(newData.length, 'games found');

   const a = _.orderBy(newData, ['name'], ['asc']);

   let datas = [];

   let abc = async () => {
      for (let game of a) {
         console.log('-------------');
         if (!game) {
            continue;
         }

         console.log(game.name);

         const getProductDetail = await axios.get(
            `https://api.duniagames.co.id/api/product/catalog/v1/product-detail/${game.slug}`,
            {
               headers: headers,
            }
         );

         if (getProductDetail.data?.data?.isHaveRedirectPage) {
            continue;
         }

         // console.log(getProductDetail.data.data.detailConfig.isZoneId);

         const isZone =
            getProductDetail.data?.data?.detailConfig?.isZoneId ||
            getProductDetail.data?.data?.detailConfig?.isServerIdRequired ||
            getProductDetail.data?.data?.detailConfig?.isNeedServerName;

         const isDropdown = getProductDetail.data.data?.serverIdOptions?.length > 0;

         const getItems = await axios.post(
            `https://api.duniagames.co.id/api/item-catalog/v1/browse-offer/${game.slug}`,
            {
               headers: headers,
            }
         );

         const item = getItems.data.data.item.regular.find((item) => +item.price > 1000);

         // console.log(item);

         if (!item) {
            console.log(`Item not found for ${game.name}`);
            continue;
         }

         const paymentChannel = item.paymentChannel.list.find(
            (channel) =>
               channel.displayNamePaymentChannel === 'QRIS' ||
               channel.displayNamePaymentChannel === 'Gopay' ||
               channel.displayNamePaymentChannel === 'Dana' ||
               channel.displayNamePaymentChannel === 'ShopeePay' ||
               channel.displayNamePaymentChannel === 'LinkAja' ||
               channel.displayNamePaymentChannel === 'telkomsel'
         );
         // console.log(item.paymentChannel);

         if (!paymentChannel) {
            console.log(`Payment channel not found for ${game.name}`);
            continue;
         }

         const dropdown =
            getProductDetail.data.data?.serverIdOptions?.map((item) => {
               return {
                  zoneId: item.optionValue,
                  name: item.optionText,
               };
            }) ?? [];

         datas.push({
            ...game,
            slug: game.slug + '-dg',
            name: game.name?.replaceAll('Top Up', '') + ' (DG)',
            isZone: isZone,
            dropdown: dropdown.length > 0 ? dropdown : undefined,
            itemId: item.itemIdentifier,
            product_ref_denom: item.productRefDenom,
            product_ref: item.productRefDenom,
            catalogId: item.paymentChannel.catalogID,
            paymentChannel: paymentChannel.id,
         });
      }
   };

   await abc();

   // Compute diff vs previous data and append summary to dg-new-res.txt
   try {
      const prevPath = './utils/data/duniagames.json';
      const hadPrev = fs.existsSync(prevPath);
      const prevData = hadPrev
         ? (() => {
              try {
                 const raw = fs.readFileSync(prevPath, 'utf8');
                 const json = JSON.parse(raw);
                 return Array.isArray(json?.data) ? json.data : [];
              } catch (e) {
                 console.warn('Warning: failed to parse previous duniagames.json, assuming empty previous data.');
                 return [];
              }
           })()
         : [];

      const keyOf = (item) => item?.slug ?? String(item?.id ?? '');
      const prevKeys = new Set(prevData.map(keyOf));
      const newKeys = new Set(datas.map(keyOf));

      const added = datas.filter((it) => !prevKeys.has(keyOf(it)));
      const removed = prevData.filter((it) => !newKeys.has(keyOf(it)));

      const now = new Date().toISOString();
      const lines = [
         `Run: ${now}`,
         `Provider: duniagames`,
         `Total current: ${datas.length}`,
         hadPrev ? `Compared with previous (${prevData.length})` : 'No previous data found (first run).',
         `Added (${added.length}):`,
         ...added.map((i, idx) => `${idx + 1}. ${i.name ?? '-'} | ${i.slug ?? ''} | id=${i.id ?? ''}`),
         '',
         `Removed (${removed.length}):`,
         ...removed.map((i, idx) => `${idx + 1}. ${i.name ?? '-'} | ${i.slug ?? ''} | id=${i.id ?? ''}`),
         '',
         '----',
         '',
      ].join('\n');

      fs.appendFile('./dg-new-res.txt', lines, 'utf8', (err) => {
         if (err) {
            console.error('Failed to write dg-new-res.txt:', err.message);
         } else {
            console.log(
               `Diff summary appended to dg-new-res.txt (added: ${added.length}, removed: ${removed.length}).`
            );
         }
      });
   } catch (e) {
      console.error('Unexpected error while generating DG diff summary:', e);
   }

   fs.writeFile('./utils/data/duniagames.json', JSON.stringify({ data: datas }, null, 2), 'utf8', function (err) {
      if (err) {
         console.log('An error occured while writing JSON Object to File.');
         return console.log(err);
      }

      console.log('JSON file has been saved.');
   });
})();
