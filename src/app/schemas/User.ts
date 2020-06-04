import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Document, model, Schema } from 'mongoose'

export interface IUserDocument extends Document {
  email: string
  name: string
  passwordHash: string
  password?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date,
  checkPassword(password: string): boolean
  generateToken(): string
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true,
  autoIndex: true
})

UserSchema.virtual('password')
  .set(function (this: { passwordHash: string }, value: string) {
    this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(10))
  })

UserSchema.method('checkPassword', function (this: IUserDocument, password: string) {
  if (password === undefined) {
    return false
  }

  const compare = bcrypt.compareSync(password, this.passwordHash)

  return compare
})

UserSchema.method('generateToken', function (this: IUserDocument, expiration?: string) {
  const secret = process.env.APP_SECRET || ''

  const token = jwt.sign(
    { _id: this.id },
    secret,
    { expiresIn: expiration || '1 day' }
  )

  return token
})

export default model<IUserDocument>('User', UserSchema)
