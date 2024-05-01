import bcrypt from 'bcrypt';
import { sequelize } from "../../config/Database.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
	"User",
	{
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{ tableName: "users", timestamps: false }
);

// Menambahkan metode untuk memvalidasi kata sandi
User.prototype.isValidPassword = async function(password) {
	try {
		// Menggunakan bcrypt untuk membandingkan kata sandi yang disediakan dengan yang disimpan dalam basis data
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		console.error('Error validating password:', error);
		return false;
	}
};

export default User;
