import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import crypto from 'crypto';

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const {
      username,
      password,
      role_id,
      email,
      full_name,
      country_code
    } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const newUser = await prisma.appUser.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    await prisma.userRole.create({
      data: {
        user_id: newUser.id,
        role_id
      }
    });

    await prisma.user.create({
      data: {
        username,
        email,
        full_name,
        country_code
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const {
            username,
            password
        } = req.body;

        const user = await prisma.appUser.findFirst({
            where: {
                username
            },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {

            res.status(401).json({
                message: 'Invalid username'
            });

            return;
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            res.status(401).json({
                message: 'Invalid password'
            });

            return;
        }

        const roleName =
            user.userRoles[0]?.role.role_name || 'viewer';

        const accessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: roleName
            },
            'secretkey',
            {
                expiresIn: '1h'
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user.id
            },
            'refreshsecretkey',
            {
                expiresIn: '7d'
            }
        );

        res.status(200).json({
            message: 'Login successful',
            token: accessToken,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                role: roleName
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const { username } = req.body;

    const user = await prisma.appUser.findFirst({
      where: {
        username
      }
    });

    if (!user) {

      res.status(404).json({
        message: 'User not found'
      });

      return;
    }

    const token = crypto
      .randomBytes(32)
      .toString('hex');

    await prisma.passwordResetToken.create({
      data: {
        user_id: user.id,
        token,
        expires_at: new Date(
          Date.now() + 15 * 60 * 1000
        )
      }
    });

    res.status(200).json({
      message: 'Reset token generated',
      token
    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      currentPassword,
      newPassword
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {

      res.status(401).json({
        message: 'Unauthorized'
      });

      return;
    }

    const user =
      await prisma.appUser.findUnique({
        where: {
          id: userId
        }
      });

    if (!user) {

      res.status(404).json({
        message: 'User not found'
      });

      return;
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {

      res.status(400).json({
        message: 'Current password incorrect'
      });

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await prisma.appUser.update({
      where: {
        id: user.id
      },
      data: {
        password: hashedPassword
      }
    });

    res.status(200).json({
      message: 'Password changed successfully'
    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      token,
      newPassword
    } = req.body;

    const resetToken =
      await prisma.passwordResetToken.findFirst({
        where: {
          token
        }
      });

    if (!resetToken) {

      res.status(400).json({
        message: 'Invalid token'
      });

      return;
    }

    if (
      new Date() > resetToken.expires_at
    ) {

      res.status(400).json({
        message: 'Token expired'
      });

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await prisma.appUser.update({
      where: {
        id: resetToken.user_id
      },
      data: {
        password: hashedPassword
      }
    });

    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id
      }
    });

    res.status(200).json({
      message: 'Password reset successful'
    });

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};
export const refreshAccessToken = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {

            res.status(401).json({
                message: 'Refresh token missing'
            });

            return;
        }

        const decoded = jwt.verify(
            refreshToken,
            'refreshsecretkey'
        ) as jwt.JwtPayload;

        const user = await prisma.appUser.findUnique({
            where: {
                id: decoded.id
            },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {

            res.status(404).json({
                message: 'User not found'
            });

            return;
        }

        const roleName =
            user.userRoles[0]?.role.role_name || 'viewer';

        const accessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: roleName
            },
            'secretkey',
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            accessToken
        });

    } catch (error) {

        res.status(401).json({
            message: 'Invalid refresh token'
        });
    }
};