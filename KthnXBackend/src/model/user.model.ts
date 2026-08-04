import mongoose,{Document, Schema,} from "mongoose";

export interface Iuser extends Document {
  name : string,
  email : string,
  password ?: string,
  googleId ?: string,
  picture : string,
  authProvider : 'local' | 'google',
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
    }
  },
  {
    timestamps : true,
    versionKey : false
  }
)

export const User = mongoose.model<Iuser>('User',userSchema)