import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const channels = await prisma.channel.findMany({
      include: {
        user: true
      }
    });

    res.status(200).json(channels);

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const getChannelById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const id = Number(req.params.id);

    const channel = await prisma.channel.findUnique({
      where: {
        channel_id: id
      }
    });

    if (!channel) {
      res.status(404).json({
        message: 'Channel not found'
      });
      return;
    }

    res.status(200).json(channel);

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const createChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const {
      channel_name,
      description
    } = req.body;

    const username = req.user?.username;

    if (!username) {
      res.status(401).json({
        message: "User not authenticated"
      });
      return;
    }

    const dbUser = await prisma.user.findFirst({
      where: {
        username
      }
    });

    if (!dbUser) {
      res.status(404).json({
        message: "User record not found in users table"
      });
      return;
    }

    const channel = await prisma.channel.create({
      data: {
        user_id: dbUser.user_id,
        channel_name,
        description
      }
    });

    res.status(201).json(channel);

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};


export const updateChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const id = Number(req.params.id);

    const {
      channel_name,
      description,
      is_verified
    } = req.body;

    const channel = await prisma.channel.update({
      where: {
        channel_id: id
      },
      data: {
        channel_name,
        description,
        is_verified
      }
    });

    res.status(200).json(channel);

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const id = Number(req.params.id);

    await prisma.channel.delete({
      where: {
        channel_id: id
      }
    });

    res.status(200).json({
      message: 'Channel deleted successfully'
    });

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};