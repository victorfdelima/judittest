import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProcessService } from './process.service';
import { Process } from './entities/process.model';
import { ProcessStage } from './enum/stage.enum';

@Controller('process')
export class ProcessController {

    constructor(private readonly processService: ProcessService) { }

    @Post('capturar-via-cnj')
    async getProcessByCnjs(@Body('searchKey') searchKey: string) {
        return this.processService.getProcessByCnj(searchKey);
    }


    @Put('details-via-cnj/:cnj/:requestId')
    async getDetailsByCNJ(
        @Param('cnj') cnj: string,
        @Param('requestId') requestId: string
    ) {
        return this.processService.getDetailsProcess(cnj, requestId);
    }

    @Post(':processId/move/:stage')
    async moveProcessToStage(@Param('processId') processId: string, @Param('stage') stage: ProcessStage): Promise<{ message: string; process: Process }> {
        try {
            const result = await this.processService.moveProcessToStage(processId, stage);
            return result;
        } catch (error) {
            throw new Error(`Erro ao mover processo para o estágio ${stage}: ${error.message}`);
        }
    }

    @Get()
    async getAllProcesses(): Promise<Process[]> {
        return this.processService.getAllProcesses();
    }


    @Get(':stageId')
    async getProcessesByStage(@Param('stageId') stageId: string): Promise<Process[]> {
        return this.processService.getProcessesByStage(stageId);
    }
}
