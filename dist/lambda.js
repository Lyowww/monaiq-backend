"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const serverless_express_1 = __importDefault(require("@codegenie/serverless-express"));
const app_module_1 = require("./app.module");
const configure_app_1 = require("./bootstrap/configure-app");
let server;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    await (0, configure_app_1.configureApp)(app, { useGlobalPrefix: true });
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return (0, serverless_express_1.default)({ app: expressApp });
}
/**
 * AWS Lambda (API Gateway) entry. In the Lambda console or template, set the handler to the
 * compiled file, for example: `dist/lambda.handler` (path depends on your zip layout).
 * Do not point the handler at `main` — that file starts `listen()` and has no export.
 */
const handler = async (event, context, callback) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
exports.handler = handler;
//# sourceMappingURL=lambda.js.map