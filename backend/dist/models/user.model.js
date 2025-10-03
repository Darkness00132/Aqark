import { DataTypes, Model } from "sequelize";
import { verify } from "argon2";
import { nanoid } from "nanoid";
import sequelize from "../db/sql.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import slugify from "../utils/slugify.js";
class User extends Model {
    async matchPassword(enteredPassword) {
        if (!this.password)
            return false;
        return await verify(this.password, enteredPassword);
    }
    async generateAuthToken() {
        const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        this.tokens = [...this.tokens, { token, createdAt: new Date() }];
        await this.save();
        return token;
    }
    toJSON() {
        return {
            slug: this.slug,
            name: this.name,
            avatar: this.avatar,
            role: this.role,
            avgRating: this.avgRating,
            totalReviews: this.totalReviews,
            credits: this.credits,
        };
    }
}
User.init({
    id: {
        type: DataTypes.STRING,
        defaultValue: () => nanoid(16),
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "الاسم لا يمكن أن يكون فارغاً" },
            len: {
                args: [3, 50],
                msg: "الاسم يجب أن يكون بين 3 و 50 حرف",
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: { msg: "البريد الإلكتروني مطلوب" },
            isEmail: { msg: "البريد الإلكتروني غير صالح" },
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
                    throw new Error("كلمة المرور ضعيفة: يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز");
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
    ips: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        defaultValue: [],
    },
    role: {
        type: DataTypes.ENUM("user", "landlord", "admin", "superAdmin", "owner"),
        allowNull: false,
        defaultValue: "user",
    },
    avatar: {
        type: DataTypes.STRING,
    },
    avatarKey: {
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
    avgRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    credits: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize,
    schema: "public",
    tableName: "users",
    timestamps: true,
    indexes: [{ fields: ["id"] }, { fields: ["email"] }, { fields: ["slug"] }],
});
User.beforeValidate((user) => {
    if (!user.slug) {
        const slugName = slugify([user.name]);
        user.slug = `${slugName}-${nanoid(10)}`;
    }
});
User.beforeSave((user) => {
    if (user.changed("name")) {
        const slugName = slugify([user.name]);
        // keep old nanoid / id part (so url stays stable except for name)
        const oldSlug = user.slug?.split("-");
        const uniquePart = oldSlug?.[oldSlug.length - 1] || nanoid(10);
        user.slug = `${slugName}-${uniquePart}`;
    }
});
export default User;
//# sourceMappingURL=user.model.js.map