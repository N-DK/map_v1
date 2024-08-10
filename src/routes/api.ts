import { Router } from 'express';
import api from '../app/controllers/APIController';
const router = Router();

router.post('/interpreter/create', api.createInterpreter);
router.put('/interpreter/save', api.saveInterpreter);
router.get('/get-displayname', api.getDisplayName);
router.get('/', api.index);

export default router;
