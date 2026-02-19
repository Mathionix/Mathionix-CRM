import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
export declare class ClientsService {
    private clientModel;
    constructor(clientModel: Model<ClientDocument>);
    private _cleanData;
    create(data: any): Promise<Client>;
    findAll(query?: any): Promise<any>;
    findOne(id: string): Promise<Client | null>;
    update(id: string, data: any): Promise<Client | null>;
    delete(id: string): Promise<any>;
}
