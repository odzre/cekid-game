const axios = require('axios');
const { writeFile, appendFile, readFileSync, existsSync } = require('fs');

(async () => {
   const codashopData = [];

   try {
      console.log('Starting codashopUpdate...');
      const homepage = await axios.post('https://shopapi.codashop.com/homePage', {
         countryCode: 'id',
         shopLang: 'id_id',
         whitelabelId: null,
         userId: null,
      });

      const feedProducts = homepage.data?.feedProducts;
      const allProducts = feedProducts.flatMap((section) => section.products);
      const uniqueMap = new Map();

      for (const product of allProducts) {
         if (!uniqueMap.has(product.productUrl)) {
            if (product.productUrl.startsWith('http')) {
               continue;
            }
            uniqueMap.set(product.productUrl, product);
         }
      }

      const uniqueProducts = Array.from(uniqueMap.values());

      console.log('Unique Products:', uniqueProducts.length);

      for (let product of uniqueProducts) {
         try {
            console.log('-');
            const productDetail = await axios.post('https://shopapi.codashop.com/productPage', {
               productPath: product.productUrl.replace('-id', ''),
               locale: 'id-id',
               whitelabelId: 0,
            });

            if (!productDetail.data) {
               console.error(`No details found for product: ${product.productName}`);
               continue;
            }

            console.log(`- ${product.productName}`);

            const isDynamic = productDetail.data.isDynamicProduct;
            let isZone = false;
            let isDropdown = false;
            let dropdown = [];

            const userInput = productDetail.data.gameUserInput;
            if (userInput.fields.length < 1) {
               console.error(`[SKIP] No user input fields for product: ${product.productName}`);
               continue;
            }

            if (userInput.fields.length > 1) {
               isZone = true;
               console.log(`- - Found multipe input. Checking for zone...`);
               // check dropdown
               const zoneInput = userInput.fields.find((input) => input.name === 'zoneId');
               if (zoneInput && zoneInput.type === 'list') {
                  console.log(`- - - Found dropdown input: ${zoneInput.name}`);
                  isDropdown = true;
                  zoneInput.data.forEach((zone) =>
                     dropdown.push({
                        zoneId: zone.value,
                        name: zone.text,
                     })
                  );
               } else {
                  console.log(`- - - No dropdown input found for zone.`);
               }
            } else {
               console.log(`- - Found single input. No zone required.`);
            }

            const productInfo = productDetail.data.productInfo;

            codashopData.push({
               name: productInfo.shortName,
               voucherTypeId: productInfo.voucherTypeId,
               voucherTypeName: productInfo.voucherTypeName,
               slug: productInfo.productUrl.replaceAll('/id/', ''),
               countryCode: productInfo.countryCode,
               gvtId: productInfo.gvtId,
               id: productInfo.id,
               isZone: isZone,
               isDynamic: isDynamic,
               isDropdown: isDropdown,
               ...(isDropdown && { dropdown }),
               provider: 'codashop',
            });
         } catch (error) {
            if (axios.isAxiosError(error)) {
               console.error(`- - [SKIP] Axios error for product ${product.productName}:`, error.message);
            } else {
               console.error(`- - [SKIP] Error for product ${product.productName}:`, error);
            }
            continue;
         }
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         console.error('Axios error:', error.message);
      }
      console.error('Error in codashopUpdate:', error);
   } finally {
      // Compute diff against previous data and append summary to coda-new-res.txt
      try {
         const prevPath = './utils/data/codashop.json';
         const hadPrev = existsSync(prevPath);
         /** @type {Array<{slug?: string, name?: string, id?: number}>} */
         const prevData = hadPrev
            ? (() => {
                 try {
                    const raw = readFileSync(prevPath, 'utf8');
                    const json = JSON.parse(raw);
                    return Array.isArray(json?.data) ? json.data : [];
                 } catch (e) {
                    console.warn('Warning: failed to parse previous codashop.json, assuming empty previous data.');
                    return [];
                 }
              })()
            : [];

         const keyOf = (item) => item?.slug ?? String(item?.id ?? '');
         const prevKeys = new Set(prevData.map(keyOf));
         const newKeys = new Set(codashopData.map(keyOf));

         const added = codashopData.filter((it) => !prevKeys.has(keyOf(it)));
         const removed = prevData.filter((it) => !newKeys.has(keyOf(it)));

         const now = new Date().toISOString();
         const lines = [
            `Run: ${now}`,
            `Total current: ${codashopData.length}`,
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

         appendFile('./coda-new-res.txt', lines, 'utf8', (err) => {
            if (err) {
               console.error('Failed to write coda-new-res.txt:', err.message);
            } else {
               console.log(
                  `Diff summary appended to coda-new-res.txt (added: ${added.length}, removed: ${removed.length}).`
               );
            }
         });
      } catch (e) {
         console.error('Unexpected error while generating diff summary:', e);
      }

      writeFile('./utils/data/codashop.json', JSON.stringify({ data: codashopData }, null, 2), 'utf8', function (err) {
         if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
         }

         console.log(`JSON file has been saved. ${codashopData.length} products.`);
      });
   }
})();
