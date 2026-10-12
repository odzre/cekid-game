const dataAU2mobile = require('./au2mobile.json');
const dataAU2mobile2 = require('./au2mobile2.json');
const dataCoda = require('./codashop.json');
const dataDunia = require('./duniagames.json');
const dataRoglobal = require('./roglobal.json');
const dataJollymax = require('./jollymax.json');
const dataElite = require('./elitedias.json');
const dataTopupLive = require('./topuplive.json');
const dataBosBos = require('./bosbosgame.json');
const dataGameku = require('./gameku.json');
const dataMobapay = require('./mobapay.json');
const dataStatsRoyale = require('./statsroyale.json');
const dataClashOfStats = require('./clashofstats.json');
const dataBrawlStar = require('./brawlstar.json');
const dataVocagame = require('./vocagame.json');
const datagempay = require('./gempay.json');
const dataMoogold = require('./moogold.json');
const dataBellachat = require('./bellachat.json');
const taktalk = require('./talktalk.json');
const dataTamichat = require('./tamichat.json');
const azalLiveData = require('./azallive.json');
const soyoChatData = require('./soyochat.json');
const olametChatData = require('./olametchat.json');
const soulChatData = require('./soulchat.json');
const data4fun = require('./4fun.json');
const dataTadaChat = require('./tadachat.json');
const wahoChatData = require('./wahochat.json');
const dataYouStar = require('./youstar.json');
const dataLemoChat = require('./lemochat.json');
const dataMykd = require('./mykd.json');
const dataGopayGames = require('./gopaygames.json');

const config = require('../../config.js');
const _ = require('lodash');

let oldDataGame = [
   ...dataCoda.data,
   ...dataDunia.data,
   ...dataAU2mobile.data,
   // ...dataRoglobal.data,
   // ...dataJollymax.data,
   // ...dataElite.data,
   ...dataTopupLive.data,
   ...(config.higsDomino ? dataBosBos.data : []),
   // ...dataGameku.data,
   ...dataAU2mobile2.data,
   ...dataMobapay.data,
   ...dataStatsRoyale.data,
   ...dataClashOfStats.data,
   // ...dataVocagame.data,
   // ...dataBrawlStar.data,
   ...datagempay.data,
   ...dataMoogold.data,
   ...dataBellachat.data,
   ...taktalk.data,
   ...dataTamichat.data,
   ...azalLiveData.data,
   ...soyoChatData.data,
   ...olametChatData.data,
   ...soulChatData.data,
   ...data4fun.data,
   ...dataTadaChat.data,
   ...wahoChatData.data,
   ...dataYouStar.data,
   ...dataLemoChat.data,
   ...dataMykd.data,
   ...dataGopayGames.data,
];

// Fillter data agar tidak duplikat slugnya

const dataGame = [...new Map(oldDataGame.map((m) => [m.slug, m])).values()];
const formatedDataGame = _.orderBy(
   dataGame.map((item) => {
      return {
         name: item.name,
         slug: item.slug,
         endpoint: `/api/game/${item.slug}`,
         query: `?id=xxxx${item.isZone ? '&zone=xxx' : ''}`,
         hasZoneId: item.isZone ? true : false,
         listZoneId: item.dropdown ? `/api/game/get-zone/${item.slug}` : null,
      };
   }),
   ['name'],
   ['asc']
);

module.exports = { dataGame, formatedDataGame };
