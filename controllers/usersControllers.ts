import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Note from '../models/Note';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

// @desc Get all users
// @route GET / users
// @access Private
const getAllUsers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
      return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
  }
);

// @desc Create new user
// @route POST / users
// @access Private
const createNewUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { userName, password, roles } = req.body;

    // Confirm data
    if (!userName || !password || !Array.isArray(roles) || !roles.length) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicates
    const duplicate = await User.findOne({ userName }).lean().exec();

    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate userName' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const userObject = { userName, password: hashedPwd, roles };

    // Create and store new user
    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ message: `New user ${userName} created` });
    } else {
      res.status(400).json({ message: 'Invalid user data recieved' });
    }
  }
);

// @desc Update user
// @route PATCH / users
// @access Private
const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id, userName, roles, active, password } = req.body;

    console.log(req.body);

    // Confirm data
    if (
      !id ||
      !userName ||
      !Array.isArray(roles) ||
      !roles.length ||
      typeof active !== 'boolean'
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ userName }).lean().exec();
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate userName' });
    }

    user.userName = userName;
    user.roles = roles;
    user.active = active;

    if (password) {
      // Hash password
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.userName} updated` });
  }
);

// @desc Delete user
// @route DELETE / users
// @access Private
const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID Required' });
    }

    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
      return res.status(400).json({ message: 'User has assigned notes' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const result = await user.deleteOne();

    const reply = `UserName ${result.userName} with ID ${result._id} deleted`;
    res.json(reply);
  }
);

export { getAllUsers, createNewUser, updateUser, deleteUser };
