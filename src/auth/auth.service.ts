import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const { name, email, password } = registerDto;

        // Check for the Existing User
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        

        const user = await this.prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
        },
        });
        
        // Create the JWT Token
        // Data we want in JWT
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        // Generate JWT Token
        const accessToken = await this.jwtService.signAsync(payload);


        return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.passwordHash,
        token: accessToken
        };
    }


    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;


        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        // Reject incorrect password
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Data we want in JWT
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        // Generate JWT Token
        const accessToken = await this.jwtService.signAsync(payload);

        // Return the user information
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: accessToken
        };
    }
}