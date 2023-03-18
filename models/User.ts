import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  password: string;
  roles: string[];
  active?: boolean;
}

const userSchema: Schema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: 'Employee',
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
