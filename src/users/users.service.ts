import { BadRequestException, Injectable } from '@nestjs/common';
import { UserSignUpDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { SignInUSereDto } from './dto/signin-user.dto';
import * as dotenv from 'dotenv';
import { sign, SignOptions } from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signIn(createUserDto: SignInUSereDto) {
    const userExist = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: createUserDto.email })
      .getOne();
    if (!userExist) {
      throw new BadRequestException('User not found');
    }
    const isPasswordMatch = await compare(
      createUserDto.password,
      userExist.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const { password, ...user } = userExist;
    return user;
  }

  async signUp(createUserDto: UserSignUpDto): Promise<UserEntity> {
    // if existing user found, throw error
    const existingUser = await this.findByEmal(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    // hash password
    const hashedPassword = await hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    let user = await this.usersRepository.save(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async findByEmal(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOneBy({ email });
  }
  async accessTocken(user: UserEntity) {
    const secret: string = process.env.JWT_SECRET ?? 'hashedSecret';
    const expiry = process.env.JWT_EXPIRY ?? '1h';

    const options: SignOptions = {
      expiresIn: expiry as SignOptions['expiresIn'],
    };

    return sign(
      {
        id: user.id,
        email: user.email,
      },
      secret,
      options,
    );
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new BadRequestException('User not found');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
