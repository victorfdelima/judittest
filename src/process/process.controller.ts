import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProcessService } from './process.service';
import { Process } from './entities/process.model';

@Controller('process')
export class ProcessController {

    constructor(private readonly processService: ProcessService) { }

    @Post('capturar-via-cnj')
    async capturarProcessoViaCNJ(@Body('searchKey') searchKey: string) {
        return this.processService.getProcessByCnj(searchKey);
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
