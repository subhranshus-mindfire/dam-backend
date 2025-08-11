import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import mongoose from 'mongoose';

/**
 * Create a new user.
 * @route POST /users
 * @param req - Express request object containing `name`, `email`, `password`, and optional `role`.
 * @param res - Express response object.
 */
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

    await user.save()

    const userObj = user.toObject();
    delete (userObj as any).password_hash;

    return res.status(201).json(userObj);
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message });
    }
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'internal error' });
  }
};

/**
 * Get all users without password hashes.
 * @route GET /users
 */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password_hash');
    return res.json(users);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'internal error' });
  }
};

/**
 * Get a user by ID without password hash.
 * @route GET /users/:id
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password_hash');
    if (!user) return res.status(404).json({ message: 'user not found' });
    return res.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'internal error' });
  }
};

/**
 * Update a user by ID.
 * @route PUT /users/:id
 * Accepts `password` to update and automatically hashes it.
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = { ...req.body } as Record<string, unknown>;

    if (typeof update.password === 'string') {
      update.password_hash = await bcrypt.hash(update.password, 10);
      delete update.password;
    }

    const updated = await User.findByIdAndUpdate(id, update, { new: true }).select('-password_hash');
    if (!updated) return res.status(404).json({ message: 'user not found' });

    await updated.save()
    return res.json(updated);
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message });
    }
    if (err && typeof err === 'object' && 'code' in err && (err as any).code === 11000) {
      return res.status(409).json({ message: 'email already exists' });
    }
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'internal error' });
  }
};

/**
 * Delete a user by ID.
 * @route DELETE /users/:id
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const del = await User.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ message: 'user not found' });
    return res.status(204).json({ message: 'user deleted' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'internal error' });
  }
};
