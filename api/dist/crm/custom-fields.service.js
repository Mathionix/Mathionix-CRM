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
exports.CustomFieldsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const custom_field_schema_1 = require("./schemas/custom-field.schema");
let CustomFieldsService = class CustomFieldsService {
    customFieldModel;
    constructor(customFieldModel) {
        this.customFieldModel = customFieldModel;
    }
    async create(createDto) {
        const created = new this.customFieldModel(createDto);
        return created.save();
    }
    async findAll(module) {
        const query = module ? { module, isActive: true } : { isActive: true };
        return this.customFieldModel.find(query).exec();
    }
    async findOne(id) {
        const field = await this.customFieldModel.findById(id).exec();
        if (!field)
            throw new common_1.NotFoundException('Custom field not found');
        return field;
    }
    async update(id, updateDto) {
        const updated = await this.customFieldModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
        if (!updated)
            throw new common_1.NotFoundException('Custom field not found');
        return updated;
    }
    async remove(id) {
        const result = await this.customFieldModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Custom field not found');
    }
};
exports.CustomFieldsService = CustomFieldsService;
exports.CustomFieldsService = CustomFieldsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(custom_field_schema_1.CustomField.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomFieldsService);
//# sourceMappingURL=custom-fields.service.js.map