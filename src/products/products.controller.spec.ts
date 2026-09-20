import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: {} }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({});

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
