import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        user_id: 'asc'
      }
    });

    res.status(200).json(users);

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        user_id: id
      }
    });

    if (!user) {
      res.status(404).json({
        message: 'User not found'
      });
      return;
    }

    res.status(200).json(user);

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const {
      username,
      email,
      full_name,
      country_code
    } = req.body;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        full_name,
        country_code
      }
    });

    res.status(201).json(user);

  } catch (error: any) {

    console.error(error);

    if (error.code === 'P2002') {
      res.status(400).json({
        message: 'Username or Email already exists'
      });
      return;
    }

    res.status(500).json({
      message: error.message
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const id = Number(req.params.id);

    const {
      full_name,
      country_code
    } = req.body;

    const user = await prisma.user.update({
      where: {
        user_id: id
      },
      data: {
        full_name,
        country_code
      }
    });

    res.status(200).json(user);

  } catch (error: any) {

    console.error(error);

    if (error.code === 'P2025') {
      res.status(404).json({
        message: 'User not found'
      });
      return;
    }

    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const id = Number(req.params.id);

    await prisma.user.delete({
      where: {
        user_id: id
      }
    });

    res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (error: any) {

    console.error(error);

    if (error.code === 'P2025') {
      res.status(404).json({
        message: 'User not found'
      });
      return;
    }

    res.status(500).json({
      message: error.message
    });
  }
};