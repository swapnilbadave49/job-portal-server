import express from 'express';
import isauthenticated from '../middleware/isauthenticated.js';
import { singleupload } from '../middleware/multer.js';

import {login,register,logout,updateProfile} from '../controllers/user.controller.js';


const router = express.Router();

router.route("/register").post(singleupload,register);
router.route("/login").post(login);
router.route("/logout").get(logout)
router.route("/profile/update").post(isauthenticated,singleupload,updateProfile);


export default router;
