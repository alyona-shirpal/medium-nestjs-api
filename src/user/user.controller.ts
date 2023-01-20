import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginDto } from '@app/user/dto/login.dto';
import { ExpressRequest } from '@app/types/expressRequest.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UsePipes(new ValidationPipe())
  @Post('users')
  async CreateUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    console.log('In the controller');
    const user = await this.userService.createUser(createUserDto);
    console.log(user);
    return this.userService.buildUserResponse(user);
  }
  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async LoginUser(
    @Body('user') loginDto: LoginDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginDto);
    return this.userService.buildUserResponse(user);
  }
  @Get()
  async currentUser(
    @Req() request: ExpressRequest,
  ): Promise<UserResponseInterface> {
    return '' as any;
    // return this.userService.buildUserResponse(request.user);
  }
}
