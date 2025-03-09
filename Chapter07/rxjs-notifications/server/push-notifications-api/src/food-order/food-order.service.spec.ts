import { Test, TestingModule } from '@nestjs/testing';
import { FoodOrderService } from './food-order.service';

describe('FoodOrderService', () => {
  let service: FoodOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodOrderService],
    }).compile();

    service = module.get<FoodOrderService>(FoodOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
