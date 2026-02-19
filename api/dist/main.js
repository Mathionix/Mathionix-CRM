"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
const bootstrap = async (expressInstance) => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance));
    app.enableCors();
    await app.init();
    return app;
};
exports.bootstrap = bootstrap;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    (0, exports.bootstrap)(server).then(async () => {
        await server.listen(process.env.PORT ?? 3001);
        console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
    });
}
exports.default = server;
//# sourceMappingURL=main.js.map