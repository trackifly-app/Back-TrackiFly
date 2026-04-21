"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const users_repository_1 = require("../users/users.repository");
const role_enum_1 = require("../common/enums/role.enum");
const user_entity_1 = require("../users/entities/user.entity");
const jwt_1 = require("@nestjs/jwt");
const profile_factory_1 = require("./profile.factory");
const roles_service_1 = require("../roles/roles.service");
const bcrypt = __importStar(require("bcrypt"));
const role_catalog_constant_1 = require("../roles/constants/role-catalog.constant");
const user_status_enum_1 = require("../common/enums/user-status.enum");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    dataSource;
    profileFactory;
    rolesService;
    constructor(usersRepository, jwtService, dataSource, profileFactory, rolesService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.dataSource = dataSource;
        this.profileFactory = profileFactory;
        this.rolesService = rolesService;
    }
    async signUp(dto, roleName) {
        if (!this.rolesService.isSelfSignUpAllowed(roleName)) {
            throw new common_1.BadRequestException(`El rol "${roleName}" no está habilitado para registro público`);
        }
        const existingUser = await this.usersRepository.getUserByEmail(dto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('El email ya se encuentra registrado');
        }
        try {
            return await this.dataSource.transaction(async (manager) => {
                const role = await this.rolesService.getRoleByName(roleName, manager);
                if (!role) {
                    throw new common_1.BadRequestException(`El rol "${roleName}" no existe`);
                }
                const initialStatus = role_catalog_constant_1.ROLE_CATALOG[roleName].requiresApproval ? user_status_enum_1.UserStatus.PENDING : user_status_enum_1.UserStatus.APPROVED;
                const hashedPassword = await bcrypt.hash(dto.password, 10);
                const user = manager.create(user_entity_1.User, {
                    email: dto.email,
                    password: hashedPassword,
                    role,
                    status: initialStatus,
                });
                const savedUser = await manager.save(user);
                await this.profileFactory.createByRole(roleName, dto, savedUser, manager);
                return savedUser.id;
            });
        }
        catch (error) {
            if (error instanceof typeorm_1.QueryFailedError) {
                const driverError = error.driverError;
                if (driverError?.code === '23505') {
                    throw new common_1.ConflictException('El email ya se encuentra registrado');
                }
            }
            throw error;
        }
    }
    async signIn(loginDto) {
        const { email, password } = loginDto;
        const foundUser = await this.usersRepository.getUserByEmail(email);
        if (!foundUser) {
            throw new common_1.BadRequestException('Email o password Incorrectos');
        }
        if (!foundUser.is_active) {
            throw new common_1.BadRequestException('La cuenta se encuentra desactivada');
        }
        const validPassword = await bcrypt.compare(password, foundUser.password);
        if (!validPassword) {
            throw new common_1.BadRequestException('Email o password Incorrectos');
        }
        if (foundUser.status !== user_status_enum_1.UserStatus.APPROVED) {
            throw new common_1.BadRequestException('La cuenta aún no ha sido aprobada o fue rechazada');
        }
        if (foundUser.role.name === role_enum_1.Role.Operator) {
            if (!foundUser.parentCompany || foundUser.parentCompany.status !== user_status_enum_1.UserStatus.APPROVED) {
                throw new common_1.BadRequestException('La empresa contratista no está autorizada para operar');
            }
        }
        const payload = {
            id: foundUser.id,
            role: foundUser.role.name,
            status: foundUser.status,
        };
        const token = this.jwtService.sign(payload);
        return {
            message: 'Usuario Logeado',
            token,
        };
    }
    async registerOperator(dto, companyId) {
        const parentCompany = await this.usersRepository.getUserById(companyId);
        if (!parentCompany) {
            throw new common_1.BadRequestException('Empresa no encontrada');
        }
        const roleName = role_enum_1.Role.Operator;
        const existingUser = await this.usersRepository.getUserByEmail(dto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('El email ya se encuentra registrado');
        }
        try {
            return await this.dataSource.transaction(async (manager) => {
                const role = await this.rolesService.getRoleByName(roleName, manager);
                if (!role)
                    throw new common_1.BadRequestException(`El rol "${roleName}" no existe`);
                const initialStatus = role_catalog_constant_1.ROLE_CATALOG[roleName].requiresApproval ? user_status_enum_1.UserStatus.PENDING : user_status_enum_1.UserStatus.APPROVED;
                const hashedPassword = await bcrypt.hash(dto.password, 10);
                const user = manager.create(user_entity_1.User, {
                    email: dto.email,
                    password: hashedPassword,
                    role,
                    status: initialStatus,
                    parentCompany: { id: parentCompany.id },
                });
                const savedUser = await manager.save(user);
                await this.profileFactory.createByRole(roleName, dto, savedUser, manager);
                return savedUser.id;
            });
        }
        catch (error) {
            if (error instanceof typeorm_1.QueryFailedError) {
                const driverError = error.driverError;
                if (driverError?.code === '23505') {
                    throw new common_1.ConflictException('El email ya se encuentra registrado');
                }
            }
            throw error;
        }
    }
    async googleSignIn(dto) {
        let user = await this.usersRepository.getUserByEmail(dto.email);
        const isNew = !user;
        if (!user) {
            await this.dataSource.transaction(async (manager) => {
                const role = await this.rolesService.getRoleByName(role_enum_1.Role.User, manager);
                if (!role)
                    throw new common_1.BadRequestException('Rol no encontrado');
                const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
                const newUser = manager.create(user_entity_1.User, {
                    email: dto.email,
                    password: randomPassword,
                    role,
                    status: user_status_enum_1.UserStatus.APPROVED,
                    phone: '',
                    address: '',
                    country: '',
                });
                const savedUser = await manager.save(newUser);
                const [first_name, ...rest] = dto.name.trim().split(' ');
                const last_name = rest.join(' ') || '';
                await this.profileFactory.createByRole(role_enum_1.Role.User, {
                    email: dto.email,
                    password: randomPassword,
                    first_name,
                    last_name,
                    gender: null,
                    birthdate: null,
                    address: 'Google Default',
                    phone: '0000000000',
                    country: 'US',
                }, savedUser, manager);
                user = savedUser;
            });
        }
        if (!user.is_active) {
            throw new common_1.BadRequestException('La cuenta se encuentra desactivada');
        }
        const payload = {
            id: user.id,
            role: user.role.name,
            status: user.status,
        };
        const token = this.jwtService.sign(payload);
        return { message: 'Usuario autenticado con Google', token, isNew };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        jwt_1.JwtService,
        typeorm_1.DataSource,
        profile_factory_1.ProfileFactory,
        roles_service_1.RolesService])
], AuthService);
//# sourceMappingURL=auth.service.js.map