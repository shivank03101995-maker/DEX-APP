import mongoose from 'mongoose'

const walletChallengeSchema = new mongoose.Schema(
  {
    walletAddress: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    nonce: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

// TTL cleanup (MongoDB will remove expired docs eventually)
walletChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const WalletChallenge =
  mongoose.models.WalletChallenge ?? mongoose.model('WalletChallenge', walletChallengeSchema)

