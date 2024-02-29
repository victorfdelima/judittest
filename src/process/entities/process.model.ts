import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProcessStage } from '../enum/stage.enum';

@Schema()
export class Process extends Document {
    @Prop()
    cnj: string;

    @Prop({ type: String, enum: Object.values(ProcessStage) })
    stage: ProcessStage;

    @Prop({ type: [{ stageId: String, date: Date }] })
    stageHistory: { stageId: string, date: Date }[];
}

export const ProcessSchema = SchemaFactory.createForClass(Process);
