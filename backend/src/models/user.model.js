const { Schema, model } = require("mongoose");
const { hash, verify } = require("argon2");
const { sign } = require("jsonwebtoken");
const { isEmail, isStrongPassword } = require("validator");

const userSchema = Schema(
  {
    googleId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator(value) {
          return isEmail(value);
        },
        message: "Invalid Email Format",
      },
    },
    password: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => {
          return isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "landlord", "admin", "superAdmin", "owner"], //user here normal one buying and landlord is one who try to sell
    },
    avatar: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expiresAt: 60 * 24 * 7,
        },
      },
    ],
    verificationToken: {
      type: String,
    },
    verificationTokenExpire: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await hash(this.password);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await verify(this.password, enteredPassword);
};

userSchema.methods.generateAuthToken = async function () {
  const token = sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  this.tokens = this.tokens.concat({ token });
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

module.exports = model("User", userSchema);
