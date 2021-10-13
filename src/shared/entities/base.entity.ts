import { Prop } from '@nestjs/mongoose';

export class Base {
  id?: string;

  @Prop({ unique: true, trim: true })
  name: string;
}
