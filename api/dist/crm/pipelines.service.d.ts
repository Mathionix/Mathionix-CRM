import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Pipeline, PipelineDocument } from './schemas/pipeline.schema';
export declare class PipelinesService implements OnModuleInit {
    private pipelineModel;
    constructor(pipelineModel: Model<PipelineDocument>);
    onModuleInit(): Promise<void>;
    create(data: any): Promise<Pipeline>;
    findAll(): Promise<Pipeline[]>;
    findOne(id: string): Promise<Pipeline | null>;
    update(id: string, data: any): Promise<Pipeline | null>;
    delete(id: string): Promise<any>;
    seedDefault(): Promise<void>;
}
