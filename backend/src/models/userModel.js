import mongoose from "mongoose";
import validator from "validator";   // npm install validator

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format"
      }
    },

    password: {
      type: String,
      // required: [true, "Password is required"],
      // minlength: [6, "Password must be at least 6 characters"],
      // validate: {
      //   validator: function (v) {
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(v);
      //   },
      //   message:
      //     "Password must contain uppercase, lowercase, number and be 6+ chars"
      // }
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Mobile number must be 10 digits"
      }
    },
    roles: {
      type: String,
      enum: ["user", "owner", "delivery"],
      required: [true, "Role is required"]
    },
    resetOtp:{
      type:String
    },
    isOtpVerified:{
      type:Boolean,
      default:false
    },
    otpExpires:{
      type:Date,
    },
    socketId:{
      type:String,
    },
    location:{
      type:{type:String,enum:['Point'],default:'Point'},
      coordinates:{type:[Number],default:[0,0]}
    },
  },
  { timestamps: true }
);
UserSchema.index({location:'2dsphere'})
const User = mongoose.model("User", UserSchema);
export default User;
