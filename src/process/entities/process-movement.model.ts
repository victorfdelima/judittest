import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ProcessMovement extends Document {
    @Prop()
    processId: string;

    @Prop()
    listId: string;

    @Prop()
    timestamp: Date;
}

export const ProcessMovementSchema = SchemaFactory.createForClass(ProcessMovement);
