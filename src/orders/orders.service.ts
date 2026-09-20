import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: number, createOrderDto: CreateOrderDto) {
        const order = await this.prisma.order.create({
        data: {
            userId,
            totalAmount: createOrderDto.totalAmount,
        },
        });

        return order;
    }
}