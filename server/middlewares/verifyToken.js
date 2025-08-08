import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const token = req.cookies?.token;
	if (!token)
		return res.status(403).json({ error: "Access denied. Please login" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ error: "Invalid or expired token." });
	}
};

export default verifyToken;
