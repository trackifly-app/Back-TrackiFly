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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDto = void 0;
const class_validator_1 = require("class-validator");
const gender_enum_1 = require("../../common/gender.enum");
class RegisterUserDto {
    name;
    email;
    password;
    address;
    phone;
    gender;
    birthdate;
    country;
    roleId;
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener almenos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(80, { message: 'E nombre no puede tener más de 80 caracteres' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El email no puede estar vacío' }),
    (0, class_validator_1.IsEmail)({}, { message: 'El email debe tener una estructura válida' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña no puede estar vacía' }),
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    (0, class_validator_1.MaxLength)(100, {
        message: 'La contraseña no puede tener más de 100 caracteres',
    }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La dirección no puede estar vacía' }),
    (0, class_validator_1.IsString)({ message: 'La dirección debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'La dirección debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(150, {
        message: 'La dirección no puede tener más de 150 caracteres',
    }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El numero de telefono no puede estar vacío' }),
    (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }, { message: 'Telefono debe ser un numero' }),
    (0, class_validator_1.Min)(1000000, { message: 'El teléfono debe tener al menos 7 dígitos' }),
    (0, class_validator_1.Max)(99999999999999, {
        message: 'El teléfono no puede superar los 14 dígitos',
    }),
    __metadata("design:type", Number)
], RegisterUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El género no puede estar vacío' }),
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender, { message: 'El género debe ser un valor válido' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de nacimiento no puede estar vacía' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de nacimiento debe tener formato ISO' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "birthdate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El país no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El país debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El país debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(80, { message: 'El país no puede tener más de 80 caracteres' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'El rol debe ser un UUID válido' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "roleId", void 0);
//# sourceMappingURL=register-user.dto.js.map