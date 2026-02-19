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
exports.CustomFieldSchema = exports.CustomField = exports.CustomFieldType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var CustomFieldType;
(function (CustomFieldType) {
    CustomFieldType["TEXT"] = "text";
    CustomFieldType["NUMBER"] = "number";
    CustomFieldType["DATE"] = "date";
    CustomFieldType["SELECT"] = "select";
    CustomFieldType["CHECKBOX"] = "checkbox";
})(CustomFieldType || (exports.CustomFieldType = CustomFieldType = {}));
let CustomField = class CustomField {
    name;
    key;
    type;
    module;
    options;
    required;
    description;
    isActive;
};
exports.CustomField = CustomField;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomField.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], CustomField.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: CustomFieldType }),
    __metadata("design:type", String)
], CustomField.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomField.prototype, "module", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], CustomField.prototype, "options", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], CustomField.prototype, "required", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomField.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CustomField.prototype, "isActive", void 0);
exports.CustomField = CustomField = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CustomField);
exports.CustomFieldSchema = mongoose_1.SchemaFactory.createForClass(CustomField);
//# sourceMappingURL=custom-field.schema.js.map