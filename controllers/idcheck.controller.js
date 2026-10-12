/*
  ------------------------------------------------------------------------
  Hak Cipta © 2025 oleh  [Nama Kamu].

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

const { dataGame } = require('../utils/data');
const {
   codashopServices,
   codashop2Services,
   codashop3Services,
   duniaGamesServices,
   au2mobileServices,
   roGlobalServices,
   jollymaxServices,
   elitediasServices,
   bosBosGameServices,
   gamekuServices,
   au2mobile2Services,
   statsRoyaleService,
   clashOfStatsService,
   brawlStarService,
   vocagameServices,
   gempayServices,
   bellachatServices,
   taktalkServices,
   tamiChatServices,
   azalLiveServices,
   soyoChatServices,
   olametChatServices,
   soulChatServices,
   FourFunChatServices,
   // codashop3Services,
   codashop4Services,
   tadachatServices,
   wahoChatServices,
   youstarChatServices,
   lemoChatServices,
   mykdServices,
   gopayGamesServices,
} = require('../services');
const topupLiveServices = require('../services/topupLive.services');
const mobapayService = require('../services/mobapay.services');
const moogoldServices = require('../services/moogold.services');

const config = require('../config');
const license = require('../license');

const idCheckController = async (req, res) => {
   const slug = req.params.game;
   const { id, zone, region } = req.query;

   const game = dataGame.find((item) => item.slug === slug);
   if (!game) return res.status(404).json({ status: false, message: 'Game not found' });
   if (!id) return res.status(400).json({ status: false, message: 'ID is required' });
   if (game.isZone && !zone) return res.status(400).json({ status: false, message: 'Zone is required' });

   if (config.useLicense) {
      const { key } = req.query;
      if (!key) return res.status(400).json({ status: false, message: 'License key is required' });

      const checkLicense = license.find((item) => item.key === key);
      if (!checkLicense) return res.status(401).json({ status: false, message: 'Invalid license key' });
   }

   switch (game.provider) {
      case 'codashop':
         const getCoda = await codashop4Services(game, id, zone);
         return res.status(getCoda?.code ?? 200).json(getCoda);
      case 'duniagames':
         const getDg = await duniaGamesServices(game, id, zone);
         return res.status(getDg.code).json(getDg);
      case 'au2mobile':
         const getAu = await au2mobileServices(game, id, zone);
         return res.status(getAu.code).json(getAu);
      case 'roglobal':
         const getRo = await roGlobalServices(game, id, zone);
         return res.status(getRo.code).json(getRo);
      case 'jollymax':
         const checkJolly = await jollymaxServices(game, id, zone);
         return res.status(checkJolly.code).json(checkJolly);
      case 'elitedias':
         const checkElite = await elitediasServices(game, id, zone);
         return res.status(checkElite.code).json(checkElite);
      case 'topuplive':
         const checkTL = await topupLiveServices(game, id, zone);
         return res.status(checkTL.code).json(checkTL);
      case 'bosbosgame':
         const checkBosBos = await bosBosGameServices(game, id, zone);
         return res.status(checkBosBos.code).json(checkBosBos);
      case 'gameku':
         const checkGameku = await gamekuServices(game, id, zone);
         return res.status(checkGameku.code).json(checkGameku);
      case 'au2mobile2':
         const au2mobile2 = await au2mobile2Services(game, id, zone);
         return res.status(au2mobile2.code).json(au2mobile2);
      case 'mobapay':
         const mobapay = await mobapayService(game, id, zone);
         return res.status(mobapay.code).json(mobapay);
      case 'statsroyale':
         const statsroyale = await statsRoyaleService(game, id, zone);
         return res.status(statsroyale.code).json(statsroyale);
      case 'clashofstats':
         const clashofstats = await clashOfStatsService(game, id, zone);
         return res.status(clashofstats.code).json(clashofstats);
      case 'brawlstar':
         const brawlStar = await brawlStarService(game, id, zone);
         return res.status(brawlStar.code).json(brawlStar);
      case 'vocagame':
         const vocagame = await vocagameServices(game, id, zone);
         return res.status(vocagame.code).json(vocagame);
      case 'gempay-check-region-mlbb':
         const gempay = await gempayServices(game, id, zone);
         return res.status(gempay.code).json(gempay);
      case 'moogold':
         const moogold = await moogoldServices(game, id, zone);
         return res.status(moogold.code).json(moogold);
      case 'bellachat':
         const bellachat = await bellachatServices(game, id, zone);
         return res.status(bellachat.code).json(bellachat);
      case 'talktalk':
         const talktalk = await taktalkServices(game, id, zone);
         return res.status(talktalk.code).json(talktalk);
      case 'tamichat':
         const tamichat = await tamiChatServices(game, id, zone);
         return res.status(tamichat.code).json(tamichat);
      case 'azallive':
         const azalLive = await azalLiveServices(game, id, zone);
         return res.status(azalLive.code).json(azalLive);
      case 'soyochat':
         const soyoChat = await soyoChatServices(game, id, zone);
         return res.status(soyoChat.code).json(soyoChat);
      case 'olametchat':
         const olametChat = await olametChatServices(game, id, zone);
         return res.status(olametChat.code).json(olametChat);
      case 'soulchat':
         const soulChat = await soulChatServices(game, id, zone);
         return res.status(soulChat.code).json(soulChat);
      case '4funchat':
         const fourFunChat = await FourFunChatServices(game, id, zone);
         return res.status(fourFunChat.code).json(fourFunChat);
      case 'tadachat':
         const tadaChat = await tadachatServices(game, id, zone);
         return res.status(tadaChat.code).json(tadaChat);
      case 'wahochat':
         const wahoChat = await wahoChatServices(game, id, zone);
         return res.status(wahoChat.code).json(wahoChat);
      case 'youstar':
         const youstarChat = await youstarChatServices(game, id, zone);
         return res.status(youstarChat.code).json(youstarChat);
      case 'lemochat':
         const lemoChat = await lemoChatServices(game, id, zone);
         return res.status(lemoChat.code).json(lemoChat);
      case 'mykd':
         const mykd = await mykdServices(game, id, zone);
         return res.status(mykd.code).json(mykd);
      case 'gopaygames':
         const gg = await gopayGamesServices(game, id, zone);
         return res.status(gg.code).json(gg);

      default:
         return res.status(400).json({ status: false, message: 'Provider not found' });
   }
};

module.exports = idCheckController;
