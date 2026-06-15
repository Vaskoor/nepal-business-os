import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; fullName: string; businessId?: string }) {
    return this.prisma.user.create({ data });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  }
}
