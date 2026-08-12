import mongoose,{Document, Schema,} from "mongoose";

export interface Iuser extends Document {
  name : string,
  email : string,
  password ?: string,
  googleId ?: string,
  picture : string,
  authProvider : 'local' | 'google',
  gender: 'Male' | 'Female';
  interestedIn: 'Male' | 'Female' | 'Both';
  createdAt : Date,
  updatedAt : Date
}

const userSchema = new Schema<Iuser>(
  {
    name: {
      type : String
    },
    email : {
      type: String,
      required : true,
      unique: true,
      trim: true,
      lowercase : true
    },
    password : {
      type : String,
      required: function() :boolean { 
        const user = this as Iuser
        return user.authProvider === 'local'; 
      },
      select : false
    },
    googleId : {
      type : String,
      sparse : true,
      unique : true
    },
    picture : {
      type : String
    },
    authProvider: {
      type : String,
      enum : ['local','google'],
      default : 'local'
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
      default: 'Male'
    },
    interestedIn: {
      type: String,
      enum: ['Male', 'Female', 'Both'],
      required: true,
      default: 'Both'
    }
  },
  {
    timestamps : true,
    versionKey : false
  }
)

export const User = mongoose.model<Iuser>('User',userSchema)