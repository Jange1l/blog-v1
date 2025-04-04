import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  username: string
  email: string
  password: string
  highestScore: number
  comparePassword: (candidatePassword: string) => Promise<boolean>
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      maxlength: [50, 'Username cannot be more than 50 characters'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    highestScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Only create the model if it doesn't exist already (for Next.js hot reloading)
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
