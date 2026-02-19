import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';

@Injectable()
export class ClientsService {
    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    ) { }

    private _cleanData(data: any) {
        // Aggressively remove empty strings which cause CastError on populate
        if (data.organization === "" || data.organization === null || data.organization === undefined) {
            delete data.organization;
        }
        return data;
    }

    async create(data: any): Promise<Client> {
        return new this.clientModel(this._cleanData(data)).save();
    }

    async findAll(query: any = {}): Promise<any> {
        const { page = 1, limit = 25, search = '' } = query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter: any = {};
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

    async findOne(id: string): Promise<Client | null> {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.clientModel.findById(id).populate('organization').exec();
    }

    async update(id: string, data: any): Promise<Client | null> {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return null;
        return this.clientModel.findByIdAndUpdate(id, this._cleanData(data), { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.clientModel.findByIdAndDelete(id).exec();
    }
}
