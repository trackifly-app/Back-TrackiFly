"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("./entities/users.entity");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
let UsersRepository = class UsersRepository {
    ormUsersRepository;
    constructor(ormUsersRepository) {
        this.ormUsersRepository = ormUsersRepository;
    }
    async getAllUsers(page, limit) {
        const skip = (page - 1) * limit;
        const allUsers = await this.ormUsersRepository.find({
            skip: skip,
            take: limit,
        });
        return allUsers.map(({ password, ...userNoPassword }) => userNoPassword);
    }
    async getUserById(id) {
        const foundUser = await this.ormUsersRepository.findOneBy({ id });
        if (!foundUser)
            throw new common_1.NotFoundException(`No se encontro el usuario con id: ${id}`);
        const { password, ...filteredUser } = foundUser;
        return filteredUser;
    }
    async getUserByEmail(email) {
        return await this.ormUsersRepository.findOne({
            where: { email },
            relations: { role: true },
        });
    }
    async addUser(newUserData) {
        const user = this.ormUsersRepository.create(newUserData);
        const saveUser = await this.ormUsersRepository.save(user);
        return saveUser.id;
    }
    async updateUser(id, newDataUser) {
        const foundUser = await this.ormUsersRepository.findOneBy({ id });
        if (!foundUser)
            throw new common_1.NotFoundException(`No se encontro el usuario con id: ${id}`);
        if (newDataUser.email) {
            const existingUser = await this.ormUsersRepository.findOneBy({
                email: newDataUser.email,
            });
            if (existingUser && existingUser.id !== id)
                throw new common_1.ConflictException('El email ya está registrado');
        }
        const mergedUser = this.ormUsersRepository.merge(foundUser, newDataUser);
        const saveUser = await this.ormUsersRepository.save(mergedUser);
        const { password, ...filteredUser } = saveUser;
        return filteredUser;
    }
    async deleteUser(id) {
        const foundUser = await this.ormUsersRepository.findOneBy({ id });
        if (!foundUser)
            throw new common_1.NotFoundException(`No existe usuario con id ${id}`);
        await this.ormUsersRepository.remove(foundUser);
        return foundUser.id;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map