import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private userModel: SoftDeleteModel<UserDocument>) {}  // Type generic of ts Model<User> : ép kiểu Model cho User

  getHashPassword= (password: string) => { // hash user password
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
    // Store hash in your password DB.
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    // add logic check email  
    const isExist = await this.userModel.findOne({ email });
    if(isExist){
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác`)
    }
    const hashPassword = this.getHashPassword(password)
    let newUser = await this.userModel.create({
      name, email,
      password: hashPassword, 
      age, gender, address, role, company,
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

  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updated = await this.userModel.updateOne(
      { _id : updateUserDto._id }, 
      { ...updateUserDto, 
        updatedBy: {
          _id: user._id,
          email: user.email
        } 
      }
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return `Not found user`
    await this.userModel.updateOne(
      { _id: id },
      { deletedBy: {
        _id: user._id,
        email: user.email
      }}
    )
    return this.userModel.softDelete({ _id :id });
  }
}
