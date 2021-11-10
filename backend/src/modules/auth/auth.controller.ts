import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    try {
      return await this.authService.register(registerAuthDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      return await this.authService.login(loginAuthDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
