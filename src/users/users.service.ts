import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private userModel: Model<User>) {}  // Type generic of ts Model<User> : ép kiểu Model cho User

  getHashPassword= (password: string) => { // hash user password
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
    // Store hash in your password DB.
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password)
    let user = await this.userModel.create({
      email: createUserDto.email, 
      password: hashPassword, 
      name: createUserDto.name
    })
    return user ;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return `not found user`
    return this.userModel.findOne({_id: id})
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id : updateUserDto._id }, { ...updateUserDto })
  }

  remove(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return `not found user`
    return this.userModel.deleteOne({ _id :id });
  }
}
