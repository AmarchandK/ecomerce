import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray, IsArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {
    
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      console.log('No token provided');
      req.currentUser = undefined;
      next();
    } else {
      const token = authHeader.split(' ')[1];
      const { id } = <JwtPayload>(
        verify(token, process.env.JWT_SECRET ?? 'hashedSecret')
      );
      const currentUser = await this.userService.findOne(+id);
      req.currentUser = currentUser;
      next();
    }
  }
}
interface JwtPayload {
  id: number;
}
