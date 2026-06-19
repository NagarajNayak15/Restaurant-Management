import fs from "fs"
const publicKey=fs.readFileSync("public.key")
import jwt from "jsonwebtoken"
const auth= (req,res,next)=>{
     try {

    const authHeader = req.headers.authorization;
    

    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    // const token = authHeader.split(' ')[1];
    const token=authHeader

    const decoded = jwt.verify(
      token,
      publicKey,
      {
        algorithms: ['RS256'],
      }
    );

    req.user = decoded;
     next();
    

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
    });}
}

export default auth