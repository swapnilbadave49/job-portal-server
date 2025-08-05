import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
export const registercompany = async (req, res) => {
  console.log("ithe0");
   try {
        const {name}=req.body; //name ke bdle companyname pn chalt
        if(!name) {
            return res.status(400).json({ message: "Company name is required", success: false });
        }

        console.log("ithe1");


        // Check if company already exists

        let company=await Company.findOne({ name });
        if(company) {
            return res.status(400).json({ message: "Company already exists", success: false });
        }
        
        console.log("ithe2");
        company=await Company.create({

          name:name,
          userId:req.id  // Assuming req.user contains the authenticated user's info
        });

        
        console.log("ithe3");

        return res.status(201).json({ message: "Company registered successfully", success: true, company });

        
        
   } catch (error) {
    console.error("Error in registercompany:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
   }

};

export const getAllCompany = async (req, res) => {

    try {
      const userId=req.id;
      const companies= await Company.find({ userId }).populate('userId', 'fullname email phonenumber');
      if (!companies || companies.length === 0) {
        return res.status(404).json({ message: "No companies found", success: false });
      }

      return res.status(200).json({ message: "Companies retrieved successfully", success: true, companies });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
      
    }
};


export const getCompanyById = async (req, res) => {
try {
    const companyId= req.params.id;
    const company = await Company.findById(companyId);//.populate('userId', 'fullname email phonenumber');

      if(!company)
      {
        return res.status(404).json({ message: "Company not found", success: false });
      }

      return res.status(200).json({ message: "Company retrieved successfully", success: true, company });

} catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }


};


export const updateCompany = async (req, res) => {
try {
  const {name,description,website,location,logo}=req.body;

  const file=req.file; //cloudinary part

  const updateddata={name,description,website,location};


  if (file) {
    const fileuri = getDataUri(file);
    if (!fileuri) {
      return res.status(500).json({ message: "File conversion failed", success: false });
    }

    const cloudresponse = await cloudinary.uploader.upload(fileuri.content, {
      folder: "company_logos", // optional folder
      resource_type: "image"
    });

    updateddata.logo = cloudresponse.secure_url;
  }

  const company=await Company.findByIdAndUpdate(req.params.id, updateddata, { new: true });

  if(!company)
    {
      return res.status(404).json({ message: "Company not found", success: false });
    }

    return res.status(200).json({ message: "Company updated successfully", success: true, company });

} catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }
  
};