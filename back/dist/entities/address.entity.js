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
exports.Address = void 0;
const typeorm_1 = require("typeorm");
const city_entity_1 = require("./city.entity");
let Address = class Address {
    id_direccion;
    calle;
    referencia;
    codigo_postal;
    city;
};
exports.Address = Address;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Address.prototype, "id_direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Address.prototype, "calle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Address.prototype, "referencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Address.prototype, "codigo_postal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => city_entity_1.City, (c) => c.addresses),
    (0, typeorm_1.JoinColumn)({ name: 'id_ciudad' }),
    __metadata("design:type", city_entity_1.City)
], Address.prototype, "city", void 0);
exports.Address = Address = __decorate([
    (0, typeorm_1.Entity)('direccion')
], Address);
//# sourceMappingURL=address.entity.js.map