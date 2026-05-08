import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
    avatar: { type: String, default: "" },
    department: { type: String, default: "General" },
    phone: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive", "Invited"], default: "Active" },
    lastLoginAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: "" },
    refreshTokenHash: { type: String, select: false },
    passwordResetToken: { type: String, default: "" },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre("save", async function saveHook(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);

export default User;
