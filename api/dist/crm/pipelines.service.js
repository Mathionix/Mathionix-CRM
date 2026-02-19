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
exports.PipelinesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pipeline_schema_1 = require("./schemas/pipeline.schema");
let PipelinesService = class PipelinesService {
    pipelineModel;
    constructor(pipelineModel) {
        this.pipelineModel = pipelineModel;
    }
    async onModuleInit() {
        await this.seedDefault();
    }
    async create(data) {
        return new this.pipelineModel(data).save();
    }
    async findAll() {
        return this.pipelineModel.find().sort({ order: 1 }).exec();
    }
    async findOne(id) {
        return this.pipelineModel.findById(id).exec();
    }
    async update(id, data) {
        return this.pipelineModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        return this.pipelineModel.findByIdAndDelete(id).exec();
    }
    async seedDefault() {
        const count = await this.pipelineModel.countDocuments();
        if (count === 0) {
            await this.create({
                name: 'Standard Sales',
                isDefault: true,
                stages: [
                    { name: 'Qualification', probability: 10, order: 1, isDefault: true },
                    { name: 'Needs Analysis', probability: 20, order: 2, isDefault: false },
                    { name: 'Proposal', probability: 50, order: 3, isDefault: false },
                    { name: 'Negotiation', probability: 80, order: 4, isDefault: false },
                    { name: 'Closed Won', probability: 100, order: 5, isDefault: false },
                    { name: 'Closed Lost', probability: 0, order: 6, isDefault: false },
                ]
            });
        }
    }
};
exports.PipelinesService = PipelinesService;
exports.PipelinesService = PipelinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pipeline_schema_1.Pipeline.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PipelinesService);
//# sourceMappingURL=pipelines.service.js.map