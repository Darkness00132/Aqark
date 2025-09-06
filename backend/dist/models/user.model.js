// src/models/user.model.ts
import { Schema, model, Document } from "mongoose";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import validator from "validator";
import { v4 as uuid } from "uuid";
const userSchema = new Schema({
    publicId: {
        type: String,
        unique: true,
        index: true,
        default: uuid, // auto-generate
    },
    googleId: { type: String, index: true },
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Invalid Email Format",
        },
    },
    password: {
        type: String,
        trim: true,
        validate: {
            validator: (value) => value
                ? validator.isStrongPassword(value, {
                    minLength: 6,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
                : true,
            message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
        },
    },
    isVerified: { type: Boolean, default: false, required: true },
    role: {
        type: String,
        required: true,
        enum: ["user", "landlord", "admin", "superAdmin", "owner"],
    },
    avatar: { type: String },
    tokens: [
        {
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now, expires: 60 * 24 * 7 },
        },
    ],
    verificationToken: { type: String, index: true },
    verificationTokenExpire: { type: Date },
    resetPasswordToken: { type: String, index: true },
    resetPasswordTokenExpire: { type: Date },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    if (this.password)
        this.password = await hash(this.password);
    next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password)
        return false;
    return await verify(this.password, enteredPassword);
};
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    this.tokens.push({ token, createdAt: new Date() });
    await this.save();
    return token;
};
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    return {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
    };
};
const User = model("User", userSchema);
export default User;
