import { IsEmail, IsNotEmpty } from 'class-validator';
//Data Tranfer Object (DTO)
export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    password: string;

    name: string;
    address: string;
}
