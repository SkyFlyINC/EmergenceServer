import { Router } from 'express';
import { BasicController } from '../controllers/basic.controller';

const router = Router();

router.get('/:key', BasicController.getBasicInfo);
router.put('/', BasicController.updateBasicInfo);

export default router;
