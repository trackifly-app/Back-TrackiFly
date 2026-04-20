import { UsersRepository } from './users.repository';
import { Users } from './entities/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    getAllUsers(page: number, limit: number): Promise<Omit<Users, 'password'>[]>;
    getUserById(id: string): Promise<Omit<Users, 'password'>>;
    updateUser(id: string, newDataUser: RegisterUserDto): Promise<Omit<Users, 'password'>>;
    deleteUser(id: string): Promise<string>;
}
