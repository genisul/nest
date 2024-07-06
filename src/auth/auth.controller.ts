import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/schemas/schema';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(
    @Body() data: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return this.authService.signIn(data, res);
  }

  @Post('/signup')
  async createUser(@Body() data: User): Promise<User> {
    return await this.authService.createUser(data);
  }

  @Get('/verify-token')
  @UseGuards(JwtAuthGuard)
  async verifyToken() {
    return { message: 'Authenticated requset successful' };
  }
}
