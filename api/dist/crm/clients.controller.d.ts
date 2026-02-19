import { ClientsService } from './clients.service';
import { GlobalSearchService } from './global-search.service';
export declare class ClientsController {
    private readonly clientsService;
    private readonly searchService;
    constructor(clientsService: ClientsService, searchService: GlobalSearchService);
    globalSearch(q: string): Promise<any>;
    findAll(query: any): Promise<any>;
    create(data: any): Promise<import("./schemas/client.schema").Client>;
    findOne(id: string): Promise<import("./schemas/client.schema").Client | null>;
    update(id: string, data: any): Promise<import("./schemas/client.schema").Client | null>;
    delete(id: string): Promise<any>;
}
