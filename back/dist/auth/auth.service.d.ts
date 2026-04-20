import { RegisterUserDto } from '../user/dto/register-user.dto';
import { UsersRepository } from '../user/users.repository';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../user/entities/roles.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly userRespository;
    private readonly jwtService;
    private readonly roleRepository;
    constructor(userRespository: UsersRepository, jwtService: JwtService, roleRepository: Repository<Role>);
    singUp(newUserData: RegisterUserDto): Promise<string>;
    singIn(email: string, password: string): Promise<{
        message: string;
        token: string;
    }>;
}
