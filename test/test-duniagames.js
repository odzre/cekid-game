const axios = require('axios');
const duniaGamesServices = require('../services/duniagames.services.js');
const fs = require('fs');

const { dataGame } = require('../utils/data');

(async () => {
   const codashopData = dataGame.filter((item) => item.provider === 'duniagames');

   let resultData = [];

   try {
      for (const game of codashopData) {
         //  console.log('Processing game:', game);
         const hasDropdown = game?.dropdown && Array.isArray(game?.dropdown) ? game.dropdown.length > 0 : false;

         const id = 1;
         let zone = game?.isZone ? '1' : null;
         try {
            if (hasDropdown) {
               zone = game.dropdown[0]?.zoneId;
            }

            const getCoda = await duniaGamesServices(game, id, zone);

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

         await new Promise((resolve) => setTimeout(resolve, 500)); // Delay 1 second between requests
      }
   } catch (error) {
      console.error('Error:', error.message);
   } finally {
      console.log('All requests completed. Saving results to file...', resultData.length);

      fs.writeFileSync('duniagames_results.txt', resultData.join('\n'), 'utf8');
   }
})();
