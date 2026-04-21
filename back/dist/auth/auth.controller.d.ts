import type { Response } from 'express';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RegisterCompanyDto } from './dtos/register-company.dto';
import { RegisterOperatorDto } from './dtos/register-operator.dto';
import { LoginDto } from './dtos/login.dto';
import { Role } from '../common/enums/role.enum';
import { GoogleAuthDto } from './dtos/google-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpUser(dto: RegisterUserDto): Promise<{
        message: string;
        user_id: string;
    }>;
    signUpCompany(dto: RegisterCompanyDto): Promise<{
        message: string;
        user_id: string;
    }>;
    signIn(credentials: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Response<any, Record<string, any>>;
    getMe(req: Request & {
        user: {
            id: string;
            role: string;
            status: string;
        };
    }): {
        id: string;
        role: string;
        status: string;
    };
    registerOperator(req: Request & {
        user: {
            id: string;
            role: Role;
            status: string;
        };
    }, dto: RegisterOperatorDto): Promise<{
        message: string;
        user_id: string;
    }>;
    googleAuth(dto: GoogleAuthDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
