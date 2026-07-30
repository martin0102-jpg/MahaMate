// ============================================================
// ROUTES KEGIATAN
// ============================================================

const express = require('express');
const router = express.Router();
const kegiatanController = require('../controllers/kegiatanControler');

router.get('/', kegiatanController.getAllKegiatan);
router.get('/:id', kegiatanController.getKegiatanById);
router.post('/', kegiatanController.createKegiatan);
router.put('/:id', kegiatanController.updateKegiatan);
router.delete('/:id', kegiatanController.deleteKegiatan);
router.patch('/:id/status', kegiatanController.updateStatusKegiatan);

module.exports = router;