import bcrypt from "bcryptjs";

export async function hashPassword(password, salt) {
	return await bcrypt.hash(password, salt);
}

export async function comparePassword(password, dbPassword) {
	return await bcrypt.compare(password, dbPassword);
}