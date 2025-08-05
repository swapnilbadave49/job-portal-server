import express from 'express';
import isauthenticated from '../middleware/isauthenticated.js';

import {registercompany,getAllCompany,getCompanyById,updateCompany} from '../controllers/company.controller.js';
import { singleupload } from '../middleware/multer.js';


const router = express.Router();

router.route("/register").post(isauthenticated,registercompany);
router.route("/get").get(isauthenticated,getAllCompany);
router.route("/get/:id").get(isauthenticated,getCompanyById);
router.route("/update/:id").put(isauthenticated,singleupload,updateCompany);


export default router;
