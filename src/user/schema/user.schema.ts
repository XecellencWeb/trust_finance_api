import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from 'src/wallet/schema/wallet.schema';

export type UserDocument = User & Document & { _id: Types.ObjectId };

export enum AccountStatus {
  active = 'active',
  suspended = 'suspended',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  ssn: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipCode: string;

  @Prop()
  accountType: string;

  @Prop({ ref: Wallet.name, type: Types.ObjectId })
  wallet: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: AccountStatus.active, enum: AccountStatus })
  accountStatus: AccountStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
