import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,        
  },
  email: {
    type: String,
    required: true,
    unique: true,     
  },
  role: {
    type: String,
    enum: ["seeker", "recruiter"]  ,
    required:true,
    
  },
  profilePhoto: { type: String, default: "" },
resume: { type: String, default: "" },

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
