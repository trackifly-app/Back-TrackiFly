import { DataSource } from 'typeorm';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dtos/login.dto';
import { Role } from '../common/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './types/register-dto.type';
import { ProfileFactory } from './profile.factory';
import { RolesService } from '../roles/roles.service';
import { RegisterOperatorDto } from './dtos/register-operator.dto';
import { GoogleAuthDto } from './dtos/google-auth.dto';
export declare class AuthService {
    private readonly usersRepository;
    private readonly jwtService;
    private readonly dataSource;
    private readonly profileFactory;
    private readonly rolesService;
    constructor(usersRepository: UsersRepository, jwtService: JwtService, dataSource: DataSource, profileFactory: ProfileFactory, rolesService: RolesService);
    signUp(dto: RegisterDto, roleName: Role): Promise<string>;
    signIn(loginDto: LoginDto): Promise<{
        message: string;
        token: string;
    }>;
    registerOperator(dto: RegisterOperatorDto, companyId: string): Promise<string>;
    googleSignIn(dto: GoogleAuthDto): Promise<{
        message: string;
        token: string;
        isNew: boolean;
    }>;
}
