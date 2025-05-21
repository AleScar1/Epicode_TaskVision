import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
  googleId: { type: String },
  verified: { type: String, default: false }
});

const userModel = mongoose.model('users', userSchema);
export default userModel;