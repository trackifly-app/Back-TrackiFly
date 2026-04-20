import { AuthService } from './auth.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginDto } from './dtos/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    singUp(newUserData: RegisterUserDto): Promise<string>;
    singIn(credentials: LoginDto): Promise<{
        message: string;
        token: string;
    }>;
}
