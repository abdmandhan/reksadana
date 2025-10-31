import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@reksadana/prisma";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    username: 'admin',
    password: 'hashedPassword',
    email: 'admin@example.com',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockJwtToken = 'mock-jwt-token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token and user when login is successful', async () => {
      // Arrange
      (prismaService.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue(mockJwtToken);

      // Act
      const result = await authService.login({ username: 'admin', password: '12341234' });

      // Assert
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.access_token).toBe(mockJwtToken);
      expect(result.user).toEqual(mockUser);
      expect(prismaService.users.findFirst).toHaveBeenCalledWith({ where: { username: 'admin' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('12341234', mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: mockUser.id });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      (prismaService.users.findFirst as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.login({ username: 'nonexistent', password: '12341234' })
      ).rejects.toThrow('User not found');
      expect(prismaService.users.findFirst).toHaveBeenCalledWith({ where: { username: 'nonexistent' } });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      (prismaService.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        authService.login({ username: 'admin', password: 'wrongpassword' })
      ).rejects.toThrow('Invalid password');
      expect(prismaService.users.findFirst).toHaveBeenCalledWith({ where: { username: 'admin' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
