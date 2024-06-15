import { User } from '@prisma/client';
import {
    extractAuthTokenFromHeader,
    extractRefreshTokenFromHeader,
} from '~/domain/auth/lib/extract-token';
import { HashService } from '~/domain/auth/services/hash.service';
import { UserRepository } from '~/domain/user/services/user.repository';
import { LoginSchema } from '../dto';
import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { HttpStatusCode } from 'axios';
import { Request } from 'express';
import { z } from 'zod';
import { VerificationService } from './verification.service';
import { generateRandomPassword } from '../lib/generate-random-password';

@Injectable()
export class AuthService {
    constructor(
        private hashService: HashService,
        private jwtService: JwtService,
        private userRepository: UserRepository,
        private verificationService: VerificationService
    ) {}

    async getTokens({ user }: { user: User }) {
        return {
            access: this.jwtService.sign(
                { sub: user.id, role: user.role, email: user.email },
                { expiresIn: '5s' }
            ),
            refresh: this.jwtService.sign(
                { sub: user.id, role: user.role, email: user.email },
                { expiresIn: '1d' }
            ),
        };
    }

    async login({ email, password }: z.infer<typeof LoginSchema>) {
        const user = await this.userRepository.findByEmail({ email });

        if (!user)
            throw new HttpException(
                'Invalid email or password. Please try again!',
                HttpStatusCode.Conflict
            );

        const isPasswordMatch = await this.hashService.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            throw new HttpException(
                'Invalid email or password. Please try again!',
                HttpStatusCode.Conflict
            );
        }
        if (!user.verified) {
            await this.verificationService.sendVerificationCode({ email });
            throw new HttpException(
                'Please, verify your account',
                HttpStatusCode.UpgradeRequired
            );
        }

        const tokens = await this.getTokens({ user });

        Reflect.deleteProperty(user, 'password');

        return {
            tokens,
            user,
        };
    }

    async loginWithOAuth(token: string) {
        const oauthUser = await axios.request<{ email: string }>({
            method: 'GET',
            url: 'https://www.googleapis.com/oauth2/v3/userinfo',
            headers: {
                Authorization: token,
            },
        });

        if (!oauthUser) {
            throw new HttpException('Unauthorized', HttpStatusCode.Locked);
        }

        const userInDb = await this.userRepository
            .findByEmail({
                email: oauthUser.data.email,
            })
            .catch(null);

        const res = {} as {
            tokens: Awaited<
                ReturnType<(typeof AuthService)['prototype']['getTokens']>
            >;
            user: OmitStrict<User, 'password'>;
        };

        if (!userInDb) {
            const createdUser = await this.userRepository.create({
                email: oauthUser.data.email,
                password: await this.hashService.hash(
                    generateRandomPassword(16)
                ),
            });

            res.user = createdUser;
            res.tokens = await this.getTokens({
                user: createdUser,
            });
        } else {
            res.user = userInDb;
            res.tokens = await this.getTokens({
                user: userInDb,
            });
        }

        if (!res.user.verified) {
            await this.userRepository.verify({ userId: res.user.id });
        }

        Reflect.deleteProperty(res.user, 'password');

        return res;
    }

    async refresh(req: Request) {
        const token = extractRefreshTokenFromHeader(req);
        if (!token) {
            throw new HttpException(
                'Token is not defined',
                HttpStatusCode.Locked
            );
        }

        const verified_token = await this.jwtService
            .verifyAsync(token)
            .catch(() => {
                throw new HttpException('Invalid token', HttpStatusCode.Locked);
            });

        const { sub, role } = verified_token;
        const access = this.jwtService.sign({ sub, role }, { expiresIn: '5s' });
        const refresh = this.jwtService.sign(
            { sub, role },
            { expiresIn: '1d' }
        );

        return {
            access,
            refresh,
        };
    }

    async checkSession(req: Request) {
        const bearer = extractAuthTokenFromHeader(req);
        if (!bearer)
            throw new HttpException('Invalid token', HttpStatusCode.Locked);

        const { sub } = await this.jwtService.verifyAsync(bearer).catch(() => {
            throw new HttpException(
                'Unauthorized',
                HttpStatusCode.Unauthorized
            );
        });

        const sessionUser = await this.userRepository.findById({
            id: sub,
            select: {
                email: true,
                id: true,
                role: true,
                verified: true,
            },
        });

        if (!sessionUser) {
            throw new HttpException('Unauthorized', HttpStatusCode.Locked);
        }

        return {
            user: sessionUser,
        };
    }
}
