import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// 登录和注册
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// 获取用户信息
router.post('/getUserInfo', AuthController.getUserInfo);
router.get('/getUserInfo/:id', AuthController.getUserById);
router.get('/getAllUsers', AuthController.getAllUsers);

// 更新用户信息
router.put('/updateUser', AuthController.updateUser);
router.put('/updateUser/:id', AuthController.updateUserById);

// 更新用户数据
router.put('/updateUserData', AuthController.updateUserData);
router.put('/updateUserData/:id', AuthController.updateUserDataById);

// 删除用户
router.delete('/deleteUser/:id', AuthController.deleteUserById);

// 修改密码
router.put('/changePassword', AuthController.changePassword);
router.put('/changePassword/:id', AuthController.changePasswordById);

// 更新邮箱
router.put('/updateEmail', AuthController.updateEmail);
router.put('/updateEmail/:id', AuthController.updateEmailById);

// 更新权限
router.put('/updatePermission', AuthController.updatePermission);
router.put('/updatePermission/:id', AuthController.updatePermissionById);

// 更新用户名
router.put('/updateUsername', AuthController.updateUsername);
router.put('/updateUsername/:id', AuthController.updateUsernameById);

export default router;