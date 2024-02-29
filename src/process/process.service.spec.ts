import { Test, TestingModule } from '@nestjs/testing';
import { ProcessService } from './process.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

jest.mock('axios');

describe('ProcessService', () => {
  let service: ProcessService;
  let processModelMock: Partial<Model<any>> & { save: jest.Mock };

  beforeEach(async () => {
    processModelMock = {
      save: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessService,
        {
          provide: getModelToken('Process'),
          useValue: processModelMock,
        },
      ],
    }).compile();

    service = module.get<ProcessService>(ProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error when capturing process by CNJ without APIKEY', async () => {
    const mockedResponse = {
      response: {
        status: 401,
        data: {
          error: {
            name: 'HttpUnauthorizedError',
            message: 'UNAUTHORIZED',
            data: 'MISSING_AUTHORIZATION',
          },
        },
      },
    };

    // Mock a resposta da solicitação com erro 401
    (axios.post as jest.Mock).mockRejectedValue(mockedResponse);

    const searchKey = '0817064-37.2023.8.19.0209';

    // Verifica se a função retorna uma promessa rejeitada com a mensagem de erro esperada
    await expect(service.getProcessByCnj(searchKey)).rejects.toMatchObject({
      response: {
        status: 401,
        data: {
          error: {
            name: 'HttpUnauthorizedError',
            message: 'UNAUTHORIZED',
            data: 'MISSING_AUTHORIZATION',
          },
        },
      },
    });
  });


  // it('should capture process by CNJ', async () => {
  //   const mockedResponse = {
  //     status: 200,
  //     data: {
  //       request_id: 'cb97f8ba-7736-43c7-a961-436b151cd65c',
  //       search: {
  //         search_type: 'lawsuit_cnj',
  //         search_key: '0817064-37.2023.8.19.0209',
  //         response_type: 'lawsuit',
  //         search_params: {
  //           filter: {},
  //           pagination: {},
  //         },
  //       },
  //       origin: 'api',
  //       origin_id: 'ad070209-2523-4808-b2e4-c1571e6fc82b',
  //       user_id: '82082593-c664-4d7b-b174-2f0dc4791daf',
  //       status: 'pending',
  //       created_at: '2024-02-21T17:15:02.700Z',
  //       updated_at: '2024-02-21T17:15:02.700Z',
  //       tags: {},
  //     },
  //   };

  //   (axios.post as jest.Mock).mockResolvedValue({ data: mockedResponse });

  //   const searchKey = '0817064-37.2023.8.19.0209';
  //   await expect(service.getProcessByCnj(searchKey)).resolves.toBeUndefined();

  //   expect(processModelMock.save).toHaveBeenCalled();
  // });
});
