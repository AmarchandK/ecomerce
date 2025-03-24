import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignInUSereDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsStrongPassword({}, { message: 'Password must be a strong password' })
  password: string;
}
