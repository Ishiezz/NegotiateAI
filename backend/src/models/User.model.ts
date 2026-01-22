import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole, Address } from '../../../shared/types/auth.types';

// Interface for what a User document looks like in the DB
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
  phone?: string;
  gstNumber?: string;
  address?: Address;
  isVerified: boolean;
  isActive: boolean;
  creditLimit: number;
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Interface for static model methods
interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'] as UserRole[],
      default: 'buyer',
    },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    gstNumber: { type: String, trim: true, uppercase: true },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    creditLimit: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password; // Never leak password in JSON responses
        return ret;
      },
    },
  }
);

// Hash password before saving — only if modified
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: compare entered password to stored hash
userSchema.methods.matchPassword = async function (
  this: IUser,
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

// Static method: find user by email (convenience)
userSchema.statics.findByEmail = function (email: string): Promise<IUser | null> {
  return this.findOne({ email }).exec();
};

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);