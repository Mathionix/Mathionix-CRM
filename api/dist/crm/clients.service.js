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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const client_schema_1 = require("./schemas/client.schema");
let ClientsService = class ClientsService {
    clientModel;
    constructor(clientModel) {
        this.clientModel = clientModel;
    }
    _cleanData(data) {
        if (data.organization === "" || data.organization === null || data.organization === undefined) {
            delete data.organization;
        }
        return data;
    }
    async create(data) {
        return new this.clientModel(this._cleanData(data)).save();
    }
    async findAll(query = {}) {
        const { page = 1, limit = 25, search = '' } = query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = {};
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }
        const [data, total] = await Promise.all([
            this.clientModel.find(filter)
                .populate('organization')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .exec(),
            this.clientModel.countDocuments(filter)
        ]);
        return { data, total };
    }
    async findOne(id) {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.clientModel.findById(id).populate('organization').exec();
    }
    async update(id, data) {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/))
            return null;
        return this.clientModel.findByIdAndUpdate(id, this._cleanData(data), { new: true }).exec();
    }
    async delete(id) {
        return this.clientModel.findByIdAndDelete(id).exec();
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(client_schema_1.Client.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClientsService);
//# sourceMappingURL=clients.service.js.map