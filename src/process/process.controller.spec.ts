import { Test, TestingModule } from '@nestjs/testing';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';

describe('ProcessController', () => {
  let controller: ProcessController;
  let processServiceMock: Partial<ProcessService>;

  beforeEach(async () => {
    processServiceMock = {
      getProcessByCnj: jest.fn().mockResolvedValue({}), // Mock para o método do serviço
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessController],
      providers: [
        {
          provide: ProcessService,
          useValue: processServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProcessController>(ProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should capture process by CNJ', async () => {
    const searchKey = '0817064-37.2023.8.19.0209';
    await controller.getProcessByCnjs(searchKey);

    // Verifica se o método do serviço foi chamado
    expect(processServiceMock.getProcessByCnj).toHaveBeenCalledWith(searchKey);
  });
});
