import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pipeline, PipelineDocument } from './schemas/pipeline.schema';

@Injectable()
export class PipelinesService implements OnModuleInit {
    constructor(
        @InjectModel(Pipeline.name) private pipelineModel: Model<PipelineDocument>,
    ) { }

    async onModuleInit() {
        await this.seedDefault();
    }

    async create(data: any): Promise<Pipeline> {
        return new this.pipelineModel(data).save();
    }

    async findAll(): Promise<Pipeline[]> {
        return this.pipelineModel.find().sort({ order: 1 }).exec();
    }

    async findOne(id: string): Promise<Pipeline | null> {
        return this.pipelineModel.findById(id).exec();
    }

    async update(id: string, data: any): Promise<Pipeline | null> {
        return this.pipelineModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
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
}
