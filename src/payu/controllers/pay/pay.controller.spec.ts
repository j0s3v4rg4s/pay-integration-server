import { Test, TestingModule } from '@nestjs/testing';
import { PayController } from './pay.controller';

describe('Pay Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PayController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PayController = module.get<PayController>(PayController);
    expect(controller).toBeDefined();
  });
});
