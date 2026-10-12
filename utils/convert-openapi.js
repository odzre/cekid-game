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

const config = require('../config');
const lisence = require('../license');
const { dataGame } = require('./data/index.js');

function convertToOpenAPI(jsonData) {
   return jsonData.reduce((acc, item) => {
      const _raw_data = dataGame.find((game) => game.slug === item.slug);
      const enumDropdown = _raw_data?.dropdown;
      const isEnum = _raw_data?.dropdown && Array.isArray(_raw_data.dropdown) && _raw_data.dropdown.length > 0;

      acc[item.endpoint] = {
         get: {
            summary: item.name,
            operationId: item.slug,
            tags: ['List Game'],
            parameters: [
               {
                  name: 'id',
                  in: 'query',
                  required: true,
                  schema: { type: 'string' },
               },
               ...(item.hasZoneId
                  ? [
                       {
                          name: 'zone',
                          in: 'query',
                          required: true,
                          schema: {
                             type: 'string',
                             //   enum: ['os_asia', 'os_eur', 'os_us'],

                             //   ...(isEnum ? { enum: enumDropdown?.map((item) => item.zoneId) } : {}),
                             //   ...(isEnum ? { 'x-enum-varnames': enumDropdown?.map((item) => item.name) } : {}),

                             //   ...(isEnum
                             //      ? {
                             //           oneOf: enumDropdown?.map((item) => ({
                             //              [item.name]: item.zoneId,
                             //              title: item.name,
                             //           })),
                             //        }
                             //      : {}),
                          },
                       },
                    ]
                  : []),

               ...(config.useLicense
                  ? [
                       {
                          name: 'key',
                          in: 'query',
                          required: true,
                          schema: { type: 'string' },
                       },
                    ]
                  : []),
            ],
            // responses: {
            //    200: {
            //       description: 'Successful response',
            //       content: {
            //          'application/json': {
            //             schema: { type: 'object' },
            //          },
            //       },
            //    },
            // },
         },
      };

      if (item.listZoneId) {
         acc[item.listZoneId] = {
            get: {
               summary: `${item.name}`,
               operationId: `get-zone-${item.slug}`,
               tags: ['List Zone'],
               // responses: {
               //    200: {
               //       description: 'Successful response',
               //       content: {
               //          'application/json': {
               //             schema: { type: 'array', items: { type: 'string' } },
               //          },
               //       },
               //    },
               // },
            },
         };
      }

      return acc;
   }, {});
}

module.exports = convertToOpenAPI;
