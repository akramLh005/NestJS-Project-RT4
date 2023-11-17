import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth-user');
    if (!token) {
      throw new UnauthorizedException('Accès refusé : pas de Token ');
    }
    try {
      const secretkey= '20Xn8@z&A3Bv%vG4#*E$z';
      const decoded = verify(token,secretkey)
      req['userId'] = decoded['userId'];
      console.log("decoded operation done :D ");
      next();
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      throw new UnauthorizedException(`Accès refusé: ${error.message}`);
    }

  }
}