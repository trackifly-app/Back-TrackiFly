import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(page?: string, limit?: string): Promise<Omit<Users, 'password'>[]>;
    getUserById(id: string): Promise<Omit<Users, 'password'>>;
    updateUser(id: string, newUserData: RegisterUserDto): Promise<Omit<Users, 'password'>>;
    deleteUser(id: string): Promise<string>;
}
