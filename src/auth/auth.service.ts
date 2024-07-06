import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/schema';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/JwtPayload.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  public readonly userList: User[] = [];

  async signIn({ email, password }: User, res: Response): Promise<any> {
    const user: User = await this.userModel.findOne({ email });
    if (!user || password !== user.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      throw new NotFoundException({
        message: `Your Email or password is inCorrect`,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...validatedUser } = user.toObject();
    const token = this.jwtService.sign(validatedUser);

    res.cookie('Authorization', `Bearer ${token}`, { httpOnly: true });
    return {
      message: 'Logged in successfully',
    };
  }

  async createUser(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  // 사용자 검증
  async validateUser({ email }: JwtPayload) {
    const user: User = await this.userModel.findOne({ email });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}
