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

    @Prop()
    message: string;
}

export const ProcessMovementSchema = SchemaFactory.createForClass(ProcessMovement);
