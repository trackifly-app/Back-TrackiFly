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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_user_dto_1 = require("./dtos/register-user.dto");
const register_company_dto_1 = require("./dtos/register-company.dto");
const register_operator_dto_1 = require("./dtos/register-operator.dto");
const login_dto_1 = require("./dtos/login.dto");
const role_enum_1 = require("../common/enums/role.enum");
const auth_guard_1 = require("./guards/auth.guard");
const google_auth_dto_1 = require("./dtos/google-auth.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signUpUser(dto) {
        const id = await this.authService.signUp(dto, role_enum_1.Role.User);
        return { message: 'Usuario registrado exitosamente.', user_id: id };
    }
    async signUpCompany(dto) {
        const id = await this.authService.signUp(dto, role_enum_1.Role.Company);
        return {
            message: 'Empresa registrada exitosamente. Cuenta pendiente de aprobación.',
            user_id: id,
        };
    }
    async signIn(credentials, res) {
        const { token, message } = await this.authService.signIn(credentials);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return res.json({ message });
    }
    logout(res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return res.json({ message: 'Sesión cerrada exitosamente' });
    }
    getMe(req) {
        return req.user;
    }
    async registerOperator(req, dto) {
        if (req.user.role !== role_enum_1.Role.Company) {
            throw new common_1.ForbiddenException('Solo empresas pueden registrar operadores');
        }
        const id = await this.authService.registerOperator(dto, req.user.id);
        return { message: 'Operador registrado exitosamente.', user_id: id };
    }
    async googleAuth(dto, res) {
        const { token, message, isNew } = await this.authService.googleSignIn(dto);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return res.json({ message, isNew });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup/user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUpUser", null);
__decorate([
    (0, common_1.Post)('signup/company'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_company_dto_1.RegisterCompanyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUpCompany", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('register-operator'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_operator_dto_1.RegisterOperatorDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerOperator", null);
__decorate([
    (0, common_1.Post)('google'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_auth_dto_1.GoogleAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map