import { DataTypes, Model } from 'sequelize';
import { hash, verify } from 'argon2';
import { customAlphabet } from 'nanoid';
import sequelize from '../db/sql.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);
class User extends Model {
    async matchPassword(enteredPassword) {
        if (!this.password)
            return false;
        return await verify(this.password, enteredPassword);
    }
    async generateAuthToken() {
        const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        this.tokens = [...this.tokens, { token, createdAt: new Date() }];
        await this.save();
        return token;
    }
    toJson() {
        return {
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            role: this.role,
        };
    }
}
User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    publicId: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
        defaultValue: () => nanoid(),
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'الاسم لا يمكن أن يكون فارغاً' },
            len: {
                args: [3, 50],
                msg: 'الاسم يجب أن يكون بين 3 و 50 حرف',
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'البريد الإلكتروني مطلوب' },
            isEmail: { msg: 'البريد الإلكتروني غير صالح' },
        },
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            isStrongPassword(value) {
                const strong = validator.isStrongPassword(value, {
                    minLength: 6,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                });
                if (!strong) {
                    throw new Error('كلمة المرور ضعيفة: يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز');
                }
            },
        },
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'landlord', 'admin', 'superAdmin', 'owner'),
        allowNull: false,
        defaultValue: 'user',
    },
    avatar: {
        type: DataTypes.STRING,
    },
    avatarId: {
        type: DataTypes.STRING,
    },
    tokens: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
    },
    verificationToken: {
        type: DataTypes.STRING,
    },
    verificationTokenExpire: {
        type: DataTypes.DATE,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
    },
    resetPasswordTokenExpire: {
        type: DataTypes.DATE,
    },
}, { sequelize, schema: 'public', tableName: 'users', timestamps: true });
User.beforeSave(async (user, option) => {
    if (user.changed('password') && user.password) {
        user.password = await hash(user.password);
    }
});
export default User;
//# sourceMappingURL=user.model.js.map