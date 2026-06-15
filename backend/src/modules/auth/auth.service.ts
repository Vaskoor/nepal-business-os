import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

// In-memory store – replace with database in production
const resetTokens = new Map<string, string>();

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) throw new BadRequestException('Email already exists');
    const hashed = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashed,
      fullName: registerDto.fullName,
      businessId: registerDto.businessId,
    });
    const { password, ...result } = user;
    return result;
  }

  login(user: any) {
    const payload = { sub: user.id, email: user.email, businessId: user.businessId, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return; // Don't reveal existence
    const token = Math.random().toString(36).substring(2, 15);
    resetTokens.set(token, user.id);
    setTimeout(() => resetTokens.delete(token), 3600000); // 1 hour expiry
    // In production, send email with link containing token
    console.log(`Reset token for ${email}: ${token}`);
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = resetTokens.get(token);
    if (!userId) throw new BadRequestException('Invalid or expired token');
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(userId, hashed);
    resetTokens.delete(token);
  }
}
