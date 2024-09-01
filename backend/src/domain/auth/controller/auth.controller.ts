import { HttpStatusCode } from 'axios';
import { z } from 'zod';
import {
  SignUpDto,
  LoginDto,
  VerificationDto,
} from 'core/dist-cjs/src/domain/auth/validation';
import { ZodValidationPipe } from '~/application/pipes/zod.validation.pipe';
import { AuthService } from '~/domain/auth/services/auth.service';
import { HashService } from '~/domain/auth/services/hash.service';
import { VerificationService } from '~/domain/auth/services/verification.service';
import { UserRepository } from '~/domain/user/services/user.repository';
import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Post,
  Put,
  Query,
  Redirect,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { extractOAuthTokenFromHeader } from '../lib/extract-token';

@Controller('auth')
export class AuthController {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private verificationService: VerificationService,
    private authService: AuthService
  ) {}

  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(SignUpDto))
  async signUp(@Body() credentials: z.infer<typeof SignUpDto>) {
    const hashedPassword = await this.hashService.hash(credentials.password);
    const payload = {
      ...credentials,
      password: hashedPassword,
    };

    const createdUser = await this.userRepository.create(payload);
    if (createdUser) {
      this.verificationService.sendVerificationCode({
        email: createdUser.email,
      });
    }

    return { createdUser };
  }

  @Put('verify')
  @UsePipes(new ZodValidationPipe(VerificationDto))
  async verify(@Body() { code, email }: z.infer<typeof VerificationDto>) {
    const user = await this.verificationService.verify({ code, email });
    if (!user?.verified) throw new InternalServerErrorException();

    return {
      verified: user.verified,
    };
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  async login(@Body() data: z.infer<typeof LoginDto>) {
    return await this.authService.login(data);
  }

  @Get('loginWithOAuth')
  async loginWithOAuth(@Req() req: Request) {
    const token = extractOAuthTokenFromHeader(req);

    if (!token?.length) {
      throw new HttpException('Unauthorized', HttpStatusCode.Locked);
    }

    return await this.authService.loginWithGoogle(token);
  }

  @Get('session')
  async session(@Req() req: Request) {
    const session = await this.authService.checkSession(req);
    return session;
  }

  @Get('refresh')
  async refresh(@Req() req: Request) {
    const newTokens = await this.authService.refresh(req);
    return newTokens;
  }

  @Get('callback/github-app')
  async githubAppCallback(@Query('code') code: string) {
    const result = await this.authService.loginWithGithubApp(code);

    return result;
  }

  /**
   * // TODO: rm this route
   * @deprecated
   * @description This route is only for development purposes. It imited button click to login with Github App.
   */
  @Get('dev/github-app')
  @Redirect()
  async loginWithGithubApp() {
    const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID;
    const url_authorize = `https://github.com/login/oauth/authorize?client_id=${GITHUB_APP_CLIENT_ID}`;

    return { url: url_authorize };
  }
}
