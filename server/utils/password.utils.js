import bcrypt from "bcryptjs";

export async function hashPassword(password, salt) {
	return await bcrypt.hash(password, salt);
}
