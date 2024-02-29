import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Process } from './entities/process.model';
import axios from 'axios';
import { ProcessStage } from './enum/stage.enum';

@Injectable()
export class ProcessService {
    constructor(@InjectModel(Process.name) private processModel: Model<Process>) { }

    async getProcessByCnj(searchKey: string): Promise<any> {
        const apiKey = process.env.APIKEY;

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
                    'api_key': apiKey,
                },
            });
            const process = new this.processModel({
                cnj: searchKey,
                stage: ProcessStage.BACKLOG,
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
        process.stageHistory.push({ stageId: stage, date: new Date() }); // Adiciona registro de log

        // Salva o processo no banco de dados
        const updatedProcess = await process.save();

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
