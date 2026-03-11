import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    walletAddress: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, trim: true, default: '' },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
)

export const User = mongoose.models.User ?? mongoose.model('User', userSchema)
