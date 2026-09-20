import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';


@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
        data: createProductDto,
        });
    }

    async findAll(query: ProductQueryDto) {
        const { page, limit } = query;

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
        this.prisma.product.findMany({
            skip,
            take: limit,
            orderBy: {
            createdAt: 'desc',
            },
        }),

        this.prisma.product.count(),
        ]);

        return {
        data: products,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        };
    }

}