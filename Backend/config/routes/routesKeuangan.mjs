/*
================
ROUTES KEUANGAN
================
*/

const express = require('express');
const router = express.router();
const keuangankontroler = require('../../controler/keuanganControler.mjs');

router.get('/', keuangankontroler.getAllKeuangan);
router.get('/:bulan/:tahum', keuangankontroler.getKeuanganByBulan);
router.get('/id/:id', keuangankontroler.getKeuanganById);
router.post('/', keuangankontroler.createKeuangan);
router.put('/:id', keuangankontroler.updateKeuangan);
router.delete('/:id/', keuangankontroler.deleteKeuangan);

module.exports = router