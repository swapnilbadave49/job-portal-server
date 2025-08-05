import jwt from 'jsonwebtoken';

const isauthenticated=async(req, res, next) => {

  try {
    
    const token =req.cookies.token;

    if(!token)
      {
        return res.status(401).json({ message: "Unauthorized user",success:false });
      }
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized user",success:false });
    }

    req.id=decoded.userId; // Attach userId to request object
    next();
  } catch (error) {
    console.error("Error in isauthenticated middleware:", error);
    return res.status(401).json({ message: "Unauthorized user: Token verification failed", success: false });
  }
}


export default isauthenticated;