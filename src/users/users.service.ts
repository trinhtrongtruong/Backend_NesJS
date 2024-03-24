import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private userModel: SoftDeleteModel<UserDocument>) {}  // Type generic of ts Model<User> : ép kiểu Model cho User

  getHashPassword= (password: string) => { // hash user password
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
    // Store hash in your password DB.
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    const hashPassword = this.getHashPassword(password)
    let newUser = await this.userModel.create({
      name, email,
      password: hashPassword, 
      gender, address, role, company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newUser ;
  }
  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    // add logic check email  
    const isExist = await this.userModel.findOne({ email });
    if(isExist){
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác`)
    }
    const hashPassword = this.getHashPassword(password)
    let newRegister = await this.userModel.create({
      name, email,  
      password: hashPassword, 
      age, gender, address, role: "USER"
    })
    return newRegister ;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return `not found user`
    return this.userModel.findOne({_id: id})
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username })
  }

  isValidPassword(password: string, hash: string){
    return compareSync(password, hash)
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id : updateUserDto._id }, { ...updateUserDto })
  }

  remove(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return `not found user`
    return this.userModel.softDelete({ _id :id });
  }
}
