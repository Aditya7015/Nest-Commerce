// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller.js';
// import { AuthService } from './auth.service.js';
// import { PrismaModule } from '../prisma/prisma.module.js';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './strategies/jwt.strategy.js';

// @Module({
//   imports: [
//     PrismaModule,
//     PassportModule.register({ defaultStrategy: 'jwt' }),
    
//     JwtModule.register({
//       secret: 'adityatiwari',
//       signOptions: {
//         expiresIn: '1h',
//       },
//     }),
//   ],

//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     JwtStrategy,
//   ],
// })
// export class AuthModule {}


import { Module } from '@nestjs/common';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
            '1h') as NonNullable<JwtModuleOptions['signOptions']>['expiresIn'],
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}