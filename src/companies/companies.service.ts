import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) // decorator of User inject to userModel. User.name is name from users.module. User is model
    private companyModel: SoftDeleteModel<CompanyDocument>) {}
    
  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create(
      { 
        ... createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id }, 
      { ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        } 
      }
    )
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(  // return => use isDelete,... and use update or use as follows
      { _id: id }, 
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        } 
        // ,
        // isDeleted: true,
        // deleteAt: new Date()
      }
    )
    return this.companyModel.softDelete({ _id :id });
  }
}
