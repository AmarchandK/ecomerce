import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { SignInUSereDto } from './dto/signin-user.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/gurds/authentication.gurds';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/user_roles.enum';
import { AutheriseGuard } from 'src/utility/gurds/autherisation.gurds';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: UserSignUpDto,
  ): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signUp(createUserDto) };
  }
  @Post('signin')
  async signIn(
    @Body() loginUserDto: SignInUSereDto,
  ): Promise<{ user: UserEntity; accessToken: string }> {
    const user = await this.usersService.signIn(loginUserDto);
    const accessToken = await this.usersService.accessTocken(user);
    return { user, accessToken };
  }
  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AutheriseGuard)
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: number): Promise<UserEntity | string> {
    return await this.usersService.findOne(+id);
  }
  @UseGuards(AuthenticationGuard)
  @Get('getUser')
  getProfile(@CurrentUser() currentUser: UserEntity): UserEntity {
    console.log('Current User==', currentUser);
    return currentUser;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
