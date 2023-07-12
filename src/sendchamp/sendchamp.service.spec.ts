import { Test, TestingModule } from '@nestjs/testing';
import { SendchampService } from './sendchamp.service';

describe('SendchampService', () => {
  let service: SendchampService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendchampService],
    }).compile();

    service = module.get<SendchampService>(SendchampService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
