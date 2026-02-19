import { PipelinesService } from './pipelines.service';
import { ReportingService } from './reporting.service';
export declare class PipelineController {
    private readonly pipelinesService;
    private readonly reportingService;
    constructor(pipelinesService: PipelinesService, reportingService: ReportingService);
    findAllPipelines(): Promise<import("./schemas/pipeline.schema").Pipeline[]>;
    createPipeline(data: any): Promise<import("./schemas/pipeline.schema").Pipeline>;
    getDealStats(): Promise<any>;
    getLeadStats(): Promise<any>;
    getActivityStats(): Promise<any>;
}
