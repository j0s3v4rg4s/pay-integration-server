import { Test, TestingModule } from '@nestjs/testing';
import { QueryController } from './query.controller';

describe('Query Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [QueryController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: QueryController = module.get<QueryController>(QueryController);
    expect(controller).toBeDefined();
  });
});
