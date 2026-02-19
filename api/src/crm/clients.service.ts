import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';

@Injectable()
export class ClientsService {
    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    ) { }

    async create(data: any): Promise<Client> {
        return new this.clientModel(data).save();
    }

    async findAll(query: any = {}): Promise<Client[]> {
        return this.clientModel.find(query).populate('organization').exec();
    }

    async findOne(id: string): Promise<Client | null> {
        return this.clientModel.findById(id).populate('organization').exec();
    }

    async update(id: string, data: any): Promise<Client | null> {
        return this.clientModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.clientModel.findByIdAndDelete(id).exec();
    }
}
