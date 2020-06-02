import { Document, model, Schema } from 'mongoose'

interface UserInterface extends Document {
  email ?: string
  firstName ?: string
  lastName ?: string
  createdAt ?: Date
  updatedAt ?: Date
  fullName(): string
}

const UserSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String
}, {
  timestamps: true
})

UserSchema.methods.fullName = function (): string {
  return `${this.firstName} ${this.lastName}`
}

export default model<UserInterface>('User', UserSchema)
