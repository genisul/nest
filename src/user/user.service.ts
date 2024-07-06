import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  [x: string]: any;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll() {
    const users: User[] = await this.userModel.find();
    return users;
  }

  async findOne(id: string) {
    const user: User = await this.userModel.findOne({ _id: id });
    if (!user) {
      // res.statusCode = 404;
      // return { message: `${id} user is not existed` };
      throw new NotFoundException({ message: `${id} user is not existed` });
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userModel.findByIdAndUpdate(id, updateUserDto);
    return { messege: `${id} user updated` };
  }
  async remove(id: string) {
    await this.userModel.findByIdAndDelete(id);
    return { Message: `${id} user deleted` };
  }
}
