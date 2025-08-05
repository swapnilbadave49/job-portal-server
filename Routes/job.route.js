import { postJob,getalljobs,getJobById,getJobsByAdmin } from "../controllers/job.controller.js";
import isauthenticated from "../middleware/isauthenticated.js";

import express from "express";


const router = express.Router();

router.route("/post").post(isauthenticated, postJob);
router.route("/get").get(isauthenticated, getalljobs);
router.route("/getadminjobs").get(isauthenticated, getJobsByAdmin);
router.route("/get/:id").get(isauthenticated, getJobById);

export default router;