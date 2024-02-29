import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessModule } from './process/process.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Process, ProcessSchema } from './process/entities/process.model';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      autoCreate: true,
    }),
    MongooseModule.forFeature([{ name: Process.name, schema: ProcessSchema }]),
    ProcessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


