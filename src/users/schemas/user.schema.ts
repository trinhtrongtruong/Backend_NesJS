import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>; // Tham chiếu DB => create document

@Schema({timestamps: true})
export class User {
  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  age: number;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAT: Date;

  @Prop()
  isDeleted: Date;

  @Prop()
  deletedAT: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);