import fs from "fs";
const publicKey = fs.readFileSync("public.key");
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "restaurant-secret";
const auth2Cust = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type !== "customer-session") {
      return res.status(401).json({ message: "Invalid customer session token" });
    }

    req.customer = decoded;
    next();
  } catch (error) {
    
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth2Cust;
