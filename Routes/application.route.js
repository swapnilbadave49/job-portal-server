import express from 'express';

import isauthenticated from '../middleware/isauthenticated.js';

import { applyjob,getappliedjobs,getapplicants,updatestatus } from '../controllers/application.controller.js';


const router = express.Router();

router.route("/apply/:id").post(isauthenticated, applyjob);

router.route("/get").get(isauthenticated, getappliedjobs);

router.route("/get/:id").get(isauthenticated, getapplicants);

router.route("/update/:id").put(isauthenticated, updatestatus);

export default router;

