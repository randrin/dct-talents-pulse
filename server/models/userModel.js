import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {
  ROLE_CANDIDATE,
  ROLE_CUSTOMER,
  STATUS_ACTIVE,
  STATUS_DISABLED,
  STATUS_PENDING,
  STATUS_SUSPENDED,
  ROLE_MEMBER,
  ROLE_ADMIN,
  GENDER_MALE,
  GENDER_FEMALE,
} from "../utils/constantsUtils.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      unique: false,
      trim: true,
    },
    lastName: {
      type: String,
      unique: true,
      trim: true,
    },
    country: { type: Object, trim: true },
    dateOfBorn: { type: String, trim: true },
    address: {
      state: { type: Object, trim: true },
      city: { type: Object, trim: true },
      zip: { type: String, trim: true },
      lineOne: { type: String, trim: true },
      lineTwo: { type: String, trim: true },
    },
    emailVerified: {
      type: Boolean,
      trim: true,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    salt: String,
    pseudo: { type: String, unique: true, lowercase: true },
    status: {
      type: String,
      enum: [STATUS_PENDING, STATUS_ACTIVE, STATUS_DISABLED, STATUS_SUSPENDED],
      default: STATUS_PENDING,
    },
    role: {
      type: String,
      enum: [ROLE_CANDIDATE, ROLE_MEMBER, ROLE_ADMIN, ROLE_CUSTOMER],
      default: ROLE_CANDIDATE,
    },
    gender: {
      type: String,
      enum: [GENDER_MALE, GENDER_FEMALE],
      default: GENDER_MALE,
    },
    email: { type: String, index: true, lowercase: true, unique: true },
    phoneNumber: { type: String, unique: false },
    photoURL: { type: Object, trim: true },
    hashed_password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// virtual
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    return bcrypt.hash(user.password, 12, function (err, hash) {
      if (err) {
        console.log("BCRYPT ERROR ---> ", err);
        return next();
      }
      user.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods = {
  comparedPassword: function (password, next) {
    bcrypt.compare(password, this.password, function (err, match) {
      if (err) {
        return next(err, false);
      }
      return next(null, match);
    });
  },
  authentificate: function (password) {
    return this.encryptPassword(password) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

const User = mongoose.model("User", userSchema);
export default User;
