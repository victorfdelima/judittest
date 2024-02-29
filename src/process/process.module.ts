import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessMovement, ProcessMovementSchema } from './entities/process-movement.model';
import { Process, ProcessSchema } from './entities/process.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Process.name, schema: ProcessSchema },
      { name: ProcessMovement.name, schema: ProcessMovementSchema },
    ]),
  ],
  providers: [ProcessService],
  controllers: [ProcessController]
})
export class ProcessModule { }
