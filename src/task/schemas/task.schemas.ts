import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/schemas/schema';

export type UserDocument = HydratedDocument<Task>;

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ required: true })
  isCompleted: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
