import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto'; // Built-in Node.js module

// 1. Define the User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  avatar?: {
    url: string;
    public_id: string;
  };
  resetPasswordToken?: string;        // Added
  resetPasswordTokenExpired?: Date;   // Added (Changed to Date for better logic)
  comparePassword(password: string): Promise<boolean>;
  createPasswordResetToken(): string; // Added
}

// 2. Create the Schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    avatar: {
      url: String,
      public_id: String,
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'customer',
    },
    // Added Fields
    resetPasswordToken: String,
    resetPasswordTokenExpired: Date, // Date is better for time comparisons
  },
  {
    timestamps: true,
  }
);

// 3. Pre-save Middleware to hash password
userSchema.pre<IUser>('save', async function () {

  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});


// 4. Instance Method to check password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 5. Method to Generate Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  // Generate a random 32-character string
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token and save it to the database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration (e.g., 10 minutes from now)
  this.resetPasswordTokenExpired = new Date(Date.now() + 10 * 60 * 1000);

  // Return the plain-text token (to send via email)
  return resetToken;
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;