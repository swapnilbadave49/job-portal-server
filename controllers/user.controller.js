import { User } from "../models/user.model.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {

  try {

    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);

    const {fullname, email, phonenumber, password, role } = req.body;
   const file= req.file; //file is the resume file uploaded by the user
    if (!fullname || !email || !phonenumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });

    }
    // if (file) {
    //   console.log("📄 file.originalname:", file.originalname);
    //   console.log("📄 file.mimetype:", file.mimetype);
    //   console.log("📄 file.size:", file.size);
    //   console.log("📄 file.buffer exists:", !!file.buffer);
    
    //   const fileuri = getDataUri(file);
    
    //   if (!fileuri) {
    //     console.log("❌ Failed to convert file to Data URI");
    //     return res.status(500).json({ message: "File conversion failed", success: false });
    //   }
    
    //   const cloudresponse = await cloudinary.uploader.upload(fileuri.content, { resource_type: 'raw' });
    //   console.log("☁️ Uploaded to Cloudinary:", cloudresponse);
    
    //   user.profile.resume = cloudresponse.secure_url;
    //   user.profile.resumeOriginalName = file.originalname;
    // }

    let resumeData = {};

if (file) {
  const fileuri = getDataUri(file);

  if (!fileuri) {
    return res.status(500).json({ message: "File conversion failed", success: false });
  }

  const cloudresponse = await cloudinary.uploader.upload(fileuri.content, {
    resource_type: "raw" // ✅ Correct for PDFs
  });

  resumeData = {
    resume: cloudresponse.secure_url,
    resumeOriginalName: file.originalname
  };
}

    
    // Check if user already exists

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists", success: false });
    }
    //hashing the password by bicrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phonenumber:phonenumber,
      password: hashedPassword,
      role,
      
    });

    return res.status(201).json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log("Error in user registration:", error);
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    };
    let user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: "Email nd Role Doesn't exist ", success: false });
    };

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password", success: false });
    };

    const tokenData = {
      userId: user._id,
    }   //user id is stored as tokenData

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" }); //token is created with userId and secret key

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phonenumber: user.phonenumber,
      role: user.role,
      profile: user.profile
    }
    return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None',secure:true }).json(
      {
        message: "Login successful",
        success: true, user, token
      }

    ); //cookie is set with token and max age of 1 day



  } catch (error) {
    console.log("Error in user login:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }

};


export const logout = async (req, res) => {

  try {
    return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'None',secure:true }).json({ message: "Logout successful", success: true });
  } catch (error) {
    console.log("Error in user logout:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }

}


export const updateProfile = async (req, res) => {

  try {
    const { fullname, email, phonenumber, bio, skills } = req.body;

    const file = req.file; //file is the resume file uploaded by the user

    //cloduinary upload will come later
    console.log("req.file:", req.file);
console.log("req.body:", req.body);
   


    let skilledArray;

    if (typeof skills === 'string') {
      skilledArray = skills.split(",").map(skill => skill.trim()).filter(Boolean);
    } else if (Array.isArray(skills)) {
      skilledArray = skills.map(skill => skill.trim()).filter(Boolean);
    } else {
      skilledArray = [];
    }

    const userId = req.id; //middleware authentication later we will see

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    if (fullname) {
      user.fullname = fullname;
    }
    if (email) {
      user.email = email;
    }
    if (phonenumber) {

      user.phonenumber = phonenumber;
    }
    if (bio) {

      user.profile.bio = bio;
    }
    if (skills !== undefined) {
      if (typeof skills === 'string' && skills.trim() === '') {
        user.profile.skills = [];
      } else {
        user.profile.skills = skilledArray;
      }
    }
    



 

    //resume comes later here
    if (file) {
      console.log("📄 file.originalname:", file.originalname);
      console.log("📄 file.mimetype:", file.mimetype);
      console.log("📄 file.size:", file.size);
      console.log("📄 file.buffer exists:", !!file.buffer);
    
      const fileuri = getDataUri(file);
    
      if (!fileuri) {
        console.log("❌ Failed to convert file to Data URI");
        return res.status(500).json({ message: "File conversion failed", success: false });
      }
    
      const cloudresponse = await cloudinary.uploader.upload(fileuri.content, {
        resource_type: 'raw'
      });
    
      user.profile.resume = cloudresponse.url;
      user.profile.resumeOriginalName = file.originalname;
    }
    
    

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phonenumber: user.phonenumber,
      role: user.role,
      profile: user.profile
    }

    return res.status(200).json({ message: "Profile updated successfully", success: true, user });

  } catch (error) {
    console.log("Error in updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
}






