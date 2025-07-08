import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { 
    type: String, 
    required: false // changed from conditional
  },
  google: { 
    type: Boolean, 
    default: false 
  },
 passkey: {

 type: mongoose.Schema.Types.Mixed, // <-- Accepts any type
},
 challenge:{
  type:String
 },
 profileImage: {
  type: String,
  default: "", 
},
bio: { type: String, default: "" }

}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {              //middleware function that runs before saving
  if (!this.isModified('password') || !this.password) {           // returns true if password field is being created or changed
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password compare method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
