import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    analysesRemaining: {
      type: Number,
      default: 10 // Free tier: 10 analyses per month
    },
    resetDate: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      }
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Reset monthly analysis quota
userSchema.methods.resetQuota = function() {
  const planLimits = {
    free: 10,
    pro: 100,
    enterprise: 1000
  };
  
  this.subscription.analysesRemaining = planLimits[this.subscription.plan];
  this.subscription.resetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
};

// Check if user has analyses remaining
userSchema.methods.canAnalyze = function() {
  // Check if quota reset date has passed
  if (new Date() >= this.subscription.resetDate) {
    this.resetQuota();
  }
  
  return this.subscription.analysesRemaining > 0;
};

// Decrement analysis count
userSchema.methods.decrementAnalysis = function() {
  if (this.subscription.analysesRemaining > 0) {
    this.subscription.analysesRemaining -= 1;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
