import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {User} from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password_hash,
      role,
    });

    const userObj = user.toObject();
    delete (userObj as any).password_hash;

    return res.status(201).json(userObj);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'internal error' });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password_hash');
    return res.json(users);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'internal error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password_hash');
    if (!user) return res.status(404).json({ message: 'user not found' });
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'internal error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = { ...req.body } as any;

    // if password present, hash it and set password_hash instead
    if (update.password) {
      update.password_hash = await bcrypt.hash(update.password, 10);
      delete update.password;
    }

    const updated = await User.findByIdAndUpdate(id, update, { new: true }).select('-password_hash');

    if (!updated) return res.status(404).json({ message: 'user not found' });

    return res.json(updated);
  } catch (err: any) {
    // handle duplicate email error
    if (err.code === 11000) {
      return res.status(409).json({ message: 'email already exists' });
    }
    return res.status(500).json({ message: err.message || 'internal error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const del = await User.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ message: 'user not found' });
    return res.json({ message: 'user deleted' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'internal error' });
  }
};
