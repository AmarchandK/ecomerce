import { Roles } from 'src/utility/common/user_roles.enum';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { SignInUSereDto } from './signin-user.dto';

export class UserSignUpDto extends SignInUSereDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Role is required' })
  role: Roles[];
}
