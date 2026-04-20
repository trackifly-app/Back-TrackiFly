import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
export declare class UsersRepository {
    private ormUsersRepository;
    constructor(ormUsersRepository: Repository<Users>);
    getAllUsers(page: number, limit: number): Promise<Omit<Users, 'password'>[]>;
    getUserById(id: string): Promise<Omit<Users, 'password'>>;
    getUserByEmail(email: string): Promise<Users | null>;
    addUser(newUserData: Partial<Users>): Promise<string>;
    updateUser(id: string, newDataUser: RegisterUserDto): Promise<Omit<Users, 'password'>>;
    deleteUser(id: string): Promise<string>;
}
