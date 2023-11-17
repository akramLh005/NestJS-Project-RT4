import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.extractToken(request);
    if (!token) {
      return false;
    }
    try {
      let payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.SECRET_KEY
        }
      )

      const UserId = payload["UserId"];
      request["UserId"] = UserId;
    } catch (e) {
      console.log(e);
    }
    return true;
  }

  async extractToken(request: Request): Promise<string | undefined> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}