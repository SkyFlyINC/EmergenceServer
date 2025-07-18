import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/getUserInfo', AuthController.getUserInfo);
router.get('/getUserInfo/:id', AuthController.getUserById);
router.get('/getAllUsers', AuthController.getAllUsers);


export default router;
