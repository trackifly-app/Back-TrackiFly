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
exports.City = void 0;
const typeorm_1 = require("typeorm");
const country_entity_1 = require("./country.entity");
const address_entity_1 = require("./address.entity");
let City = class City {
    id_ciudad;
    nombre;
    country;
    estado_provincia;
    addresses;
};
exports.City = City;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], City.prototype, "id_ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], City.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, (p) => p.cities),
    (0, typeorm_1.JoinColumn)({ name: 'id_pais' }),
    __metadata("design:type", country_entity_1.Country)
], City.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], City.prototype, "estado_provincia", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => address_entity_1.Address, (a) => a.city),
    __metadata("design:type", Array)
], City.prototype, "addresses", void 0);
exports.City = City = __decorate([
    (0, typeorm_1.Entity)('ciudad')
], City);
//# sourceMappingURL=city.entity.js.map