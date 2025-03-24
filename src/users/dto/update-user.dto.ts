import { PartialType } from '@nestjs/mapped-types';
import { UserSignUpDto } from './signup-user.dto';

export class UpdateUserDto extends PartialType(UserSignUpDto) {}
