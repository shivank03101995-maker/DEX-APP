import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    method: { type: String, required: true, enum: ['email', 'wallet'], index: true },
    email: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true, index: true },
    walletAddress: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true, index: true },
    name: { type: String, trim: true, default: '' },
    passwordHash: { type: String, required: false, select: false },
  },
  { timestamps: true }
)

export const User = mongoose.models.User ?? mongoose.model('User', userSchema)
