import {Job} from "../models/job.model.js";
export const postJob=async (req, res) => { 

try {
     const {title,description,requirements,location, salary,jobType,position,companyId} = req.body;

     const userId=req.id;

     if (!title || !description || !requirements || !location || !salary || !jobType || !position || !companyId) {
       return res.status(400).json({ message: "All fields are required", success: false });
     }

     const job = await  Job.create({
       title,
       description,
       requirements:requirements.split(',').map(req => req.trim()), // Split requirements by comma and trim whitespace
       location,
       salary:Number(salary), // Ensure salary is a number
       jobType,
       position,
       company:companyId,
       created_by:userId
     });

     return res.status(201).json({ message: "Job posted successfully", success: true, job });
} catch (error) {
  console.error("Error in posting job:", error);
  return res.status(500).json({ message: "Internal Server Error", success: false });
}

 };


 export const getalljobs = async (req, res) => {

   try {
    
       const keyword=req.query.keyword || "";

       const query={
           $or: [
               { title: { $regex: keyword, $options: "i" } }, // Search by title
               { description: { $regex: keyword, $options: "i" } }, // Search by description
               { requirements: { $regex: keyword, $options: "i" } } // Search by requirements
           ]
       };
             
      const jobs =await Job.find(query).populate('company');//hold karo
      if(!jobs)
        {
          return res.status(404).json({ message: "No jobs found", success: false });
        }
        
        return res.status(200).json({ message: "Jobs fetched successfully", success: true, jobs });


   } catch (error) {
     console.error("Error in fetching jobs:", error);
     return res.status(500).json({ message: "Internal Server Error", success: false });
    
   }

 };



export const getJobById = async (req, res) => {
  try {
    
      const jobId = req.params.id; // Get job ID from request parameters
      const job = await Job.findById(jobId).populate({
        path: "applications",
        populate: { path: "applicant", select: "_id" },  // ✅ populate applicant
      }); // Fetch job by ID and populate company details
      
   if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ message: "Job fetched successfully", success: true, job });


  } catch (error) {
    console.error("Error in fetching job by ID:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });  
    
  }

};

//for admin to get how many jobs he/she posted

export const getJobsByAdmin = async (req, res) => {
  
  try {
    
      const userId = req.id; // Get user ID from request object (authenticated user)

      const jobs = await Job.find({created_by:userId}).populate('company'); // Fetch jobs posted by the admin and populate company details

      if (!jobs || jobs.length === 0) {
        return res.status(404).json({ message: "No jobs found for this admin", success: false });
      }


      
      return res.status(200).json({ message: "Jobs fetched successfully", success: true, jobs });

  } catch (error) {
    console.error("Error in fetching jobs by admin:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });  
    
  }

};