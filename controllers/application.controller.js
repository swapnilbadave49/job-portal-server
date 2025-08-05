import {Application}from "../models/application.model.js";

import { Job } from "../models/job.model.js";
export const applyjob=async (req, res) => {

try {
  const userId=req.id; // Get user ID from request object (authenticated user)
  
  //const {id:jobId}=req.params.id;

  const jobId=req.params.id;

  if(!jobId) {
    return res.status(400).json({ message: "Job ID is required" });
  }

  // Check if the user has already applied for the job

  const existingApplication = await  Application.findOne({ userId, jobId });

  if( existingApplication) {
    return res.status(400).json({ message: "You have already applied for this job" ,success:false});
  }

  // =check if job exist

  const job =await Job.findById(jobId);

  if(!job) {
    return res.status(404).json({ message: "Job not found", success:false });
  }

  // Create a new application

  const newapplication=await Application.create({ 

    job:jobId,
    applicant:userId,
  });

  
job.applications.push(newapplication._id); // Add the application ID to the job's applications array

await job.save();

res.status(201).json({ message: "Application submitted successfully", success: true, application: newapplication });

} catch (error) {
    console.log("Error in applyjob:", error);
    res.status(500).json({ message: "Internal server error" });  
}

}



export const getappliedjobs = async (req, res) => {

  try {
    const userId = req.id; 

    const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
       path: 'job',
       options:{sort: { createdAt: -1 }},
       populate:{
           path: 'company',
           options:{sort: { createdAt: -1 }}
       }

    });

    if(!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applied jobs found", success: false });
    }
    
    res.status(200).json({ message: "Applied jobs fetched successfully", success: true, applications });  

        


  } catch (error) {
    console.log("Error in getappliedjobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
} 



export const getapplicants= async (req, res) => {

  try {
    
    const userId = req.id; 

    const jobId = req.params.id;
    
    const job =await Job.findById(jobId).populate({
   path: 'applications',
   options:{sort: { createdAt: -1 }},
   populate:{
    path: 'applicant',
    options:{sort: { createdAt: -1 }}
   }

    });

    if(!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ message: "Applicants fetched successfully", success: true, applicants: job.applications });

    
  } catch (error) {
    console.log("Error in getapplicants:", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
}


export const updatestatus= async (req, res) => {

try {
  const status = req.body.status; 

  const applicationId = req.params.id; 

  if(!status || !applicationId) {
    return res.status(400).json({ message: "Status and Application ID are required" });
  }

  const application=await Application.findById(applicationId);

  if(!application) {
    return res.status(404).json({ message: "Application not found", success: false });
  }

  application.status = status.toLowerCase(); 

  await application.save();

  return res.status(200).json({ message: "Application status updated successfully", success: true, application });
} catch (error) {
  console.log("Error in updatestatus:", error);
  res.status(500).json({ message: "Internal server error" });
}
}