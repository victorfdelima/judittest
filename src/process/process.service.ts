import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Process } from './entities/process.model';
import { ProcessMovement, ProcessMovementSchema } from './entities/process-movement.model';

import axios from 'axios';
import { ProcessStage } from './enum/stage.enum';

export interface StageHistoryItem {
    stageId: string;
    date: Date;
    message: string;
}

@Injectable()
export class ProcessService {
    constructor(
        @InjectModel(Process.name)
        private processModel: Model<Process>,
        @InjectModel(ProcessMovement.name)
        private processMovementModel: Model<ProcessMovement>

    ) { }

    async getDetailsProcess(cnj: string, requestId: string): Promise<Process> {
        const apiKey = process.env.APIKEY;

        try {

            const response = await axios.get(`https://requests.prod.judit.io/responses/?request_id=${requestId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey,
                },
            });

            const updatedProcess = await this.processModel.findOneAndUpdate(
                { cnj: cnj },
                { dadosProcesso: response.data.page_data },
                { new: true } // Retorna o documento atualizado
            );

            return updatedProcess;

        } catch (error) {

        }
    }

    async getProcessByCnj(searchKey: string): Promise<Process> {
        const apiKey = process.env.APIKEY

        const existingProcess = await this.processModel.findOne({ cnj: searchKey }).exec();

        if (existingProcess) {
            return existingProcess;
        }

        const requestData = {
            search: {
                search_type: 'lawsuit_cnj',
                search_key: searchKey,
            },
        };

        try {
            const response = await axios.post('https://requests.prod.judit.io/requests', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey,
                },
            });


            const process = new this.processModel({
                request_id: response.data.request_id,
                cnj: searchKey,
                dadosProcesso: [],
                stage: ProcessStage.BACKLOG,
                statusDoProcesso: response.data.status
            });

            return process.save();
        } catch (error) {
            throw error;
        }
    }

    async moveProcessToStage(processId: string, stage: ProcessStage): Promise<{ message: string; process: Process }> {
        const process = await this.processModel.findById(processId);
        if (!process) {
            throw new Error('Processo não encontrado');
        }

        const previousStage = process.stage; // Salva o estágio anterior antes de atualizar
        process.stage = stage;
        process.stageHistory.push({
            stageId: previousStage,
            message: `O processo foi movido de ${previousStage} para ${stage}`,
            date: new Date(),
        });
        const updatedProcess = await process.save();

        const processMovement = new this.processMovementModel({
            processId: process._id,
            listId: stage,
            timestamp: new Date(),
            message: `O processo ${process._id} foi movido de ${previousStage} para ${stage}`,
        });

        await processMovement.save();

        // Envia notificações ou executar outras ações relacionadas à mudança de estágio
        const notificationMessage = `O processo ${process._id} foi movido de ${previousStage} para ${stage}`;

        return { message: notificationMessage, process: updatedProcess };
    }

    async getProcessesByStage(stageId: string): Promise<Process[]> {
        return this.processModel.find({ stage: stageId }).exec();
    }

    async getAllProcesses(): Promise<Process[]> {
        return this.processModel.find().exec();
    }
}
