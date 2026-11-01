// ============================================================
// ROUTES TUGAS
// ============================================================

const express = require('express');
const router = express.Router();
const tugasController = require('../controllers/tugasControler');

router.get('/', tugasController.getAllTugas);
router.get('/:id', tugasController.getTugasById);
router.post('/', tugasController.createTugas);
router.put('/:id', tugasController.updateTugas);
router.delete('/:id', tugasController.deleteTugas);
router.patch('/:id/status', tugasController.updateStatusTugas);

module.exports = router;