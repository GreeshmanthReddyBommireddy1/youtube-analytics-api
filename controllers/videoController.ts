import { Request, Response } from 'express';
import prisma from '../prisma';

export const getVideos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        channel: true,
        genre: true
      },
      orderBy: {
        video_id: 'asc'
      }
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const getVideoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const video = await prisma.video.findUnique({
      where: {
        video_id: id
      },
      include: {
        channel: true,
        genre: true
      }
    });

    if (!video) {
      res.status(404).json({
        message: 'Video not found'
      });
      return;
    }

    res.status(200).json(video);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const createVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      channel_id,
      genre_id,
      title,
      description,
      duration_seconds,
      is_public
    } = req.body;

    const video = await prisma.video.create({
      data: {
        channel_id,
        genre_id,
        title,
        description,
        duration_seconds,
        is_public
      }
    });

    res.status(201).json(video);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const updateVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const {
      title,
      description,
      duration_seconds,
      is_public
    } = req.body;

    const video = await prisma.video.update({
      where: {
        video_id: id
      },
      data: {
        title,
        description,
        duration_seconds,
        is_public
      }
    });

    res.status(200).json(video);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    await prisma.video.delete({
      where: {
        video_id: id
      }
    });

    res.status(200).json({
      message: 'Video deleted successfully'
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};