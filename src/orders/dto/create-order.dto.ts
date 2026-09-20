import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
    @IsNumber()
    @IsPositive()
    totalAmount: number;
}