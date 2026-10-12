const axios = require('axios');
const Codashop4Services = require('../services/codashop4.services.js');
const fs = require('fs');

const { dataGame } = require('../utils/data');
(async () => {
   const codashopData = dataGame.filter((item) => item.provider === 'codashop');

   let resultData = [];

   try {
      for (const game of codashopData) {
         const hasDropdown = game?.dropdown ? true : false;

         const id = 1;
         let zone = game?.isZone ? '1' : null;
         try {
            if (hasDropdown) {
               zone = game.dropdown[0]?.zoneId;
            }

            const getCoda = await Codashop4Services(game, id, zone);

            console.log(game.name, ' | ', zone);
            console.log(getCoda.status, getCoda.message, getCoda.data?.username, getCoda?.error);
            console.log('----------------------------------');
            resultData.push(
               `${game.name} | ${zone} | ${getCoda.status} | ${getCoda.message} | ${getCoda.data?.username} | ${getCoda?.error}`
            );
         } catch (error) {
            console.error('Error:', error.message);
            resultData.push(`${game.name} | ${zone} | Error: ${error.message}`);
         }

         await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay 1 second between requests
      }
   } catch (error) {
      console.error('Error:', error.message);
   } finally {
      console.log('All requests completed. Saving results to file...', resultData.length);

      fs.writeFileSync('codashop_results.txt', resultData.join('\n'), 'utf8');
   }
})();
