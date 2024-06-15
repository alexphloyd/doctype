import { SignUpSchema } from '~/domain/auth/dto';
import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DBService } from '~/infrastructure/db/db.service';
import { z } from 'zod';

@Injectable()
export class UserRepository {
    constructor(private db: DBService) {}

    async create(payload: z.infer<typeof SignUpSchema>) {
        return await this.db.user
            .create({
                data: payload,
            })
            .catch((error) => {
                if (error.code === 'P2002') {
                    throw new HttpException('Email is already in use.', 409);
                } else {
                    throw new HttpException(error?.message, 500);
                }
            });
    }

    async verify({ userId }: { userId: TypeOfValue<User, 'id'> }) {
        await this.db.user.update({
            where: {
                id: userId,
            },
            data: {
                verified: true,
            },
        });
    }

    async findByEmail({
        email,
        select,
    }: {
        email: TypeOfValue<User, 'email'>;
        select?: Prisma.UserSelect;
    }) {
        return await this.db.user.findFirst({
            where: {
                email,
            },
            select,
        });
    }

    async findById({
        id,
        select,
    }: {
        id: TypeOfValue<User, 'id'>;
        select?: Prisma.UserSelect;
    }) {
        return await this.db.user.findFirst({
            where: {
                id,
            },
            select,
        });
    }

    async delete({
        where,
        select,
    }: {
        where: Prisma.UserWhereUniqueInput;
        select?: Prisma.UserSelect;
    }) {
        return await this.db.user.delete({
            where,
            select,
        });
    }
}
