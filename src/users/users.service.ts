import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        return await this.prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
        },
        });
    } catch (error) {
        if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
        ) {
        throw new ConflictException('Email already exists');
        }

        throw error;
    }
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        try {
            return await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            });
        } catch (error) {
            if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
            ) {
            throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    async remove(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.prisma.user.delete({
            where: { id },
        });

        return {
            message: 'User deleted successfully',
        };
    }
}