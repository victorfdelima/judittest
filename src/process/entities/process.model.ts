import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProcessStage } from '../enum/stage.enum';
import { StageHistoryItem } from '../process.service';

interface ResponseData {
    code: string;
    justice: string;
    tribunal: string;
    instance: number;
    distribution_date: Date;
    tribunal_acronym: string;
    county: string;
    secrecy_level: number;
    tags: {
        crawl_id: string;
    };
    subjects: {
        code: string;
        name: string;
        date: Date;
    }[];
    status: string;
    judge: string;
    classifications: {
        name: string;
        date: Date;
    }[];
    courts: {
        name: string;
        date: Date;
    }[];
    parties: {
        name: string;
        person_type: string;
        side: string;
        lawyers: {
            name: string;
            license: string;
        }[];
    }[];
    steps: {
        step_id: string;
        step_date: Date | null;
        lawsuit_cnj: string;
        lawsuit_instance: number;
        private: boolean;
        content: string;
        tags: {
            crawl_id: string;
        };
    }[];
    attachments: {
        attachment_id: string;
        attachment_type: string;
    }[];
    extra_info: Record<string, any>;
}

@Schema()
export class Process extends Document {
    @Prop()
    cnj: string;

    @Prop({ type: String, enum: Object.values(ProcessStage) })
    stage: ProcessStage;

    @Prop({ type: [{ stageId: String, date: Date, message: String }] })
    stageHistory: { stageId: string, date: Date, message: string }[];

    @Prop({ type: Object })
    dadosProcesso: ResponseData;

    @Prop()
    request_id: string;

    @Prop()
    statusDoProcesso: string;

}

export const ProcessSchema = SchemaFactory.createForClass(Process);
