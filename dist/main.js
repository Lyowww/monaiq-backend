"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = vercelHandler;
const express_1 = __importDefault(require("express"));
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("./app.module");
const configure_app_1 = require("./bootstrap/configure-app");
const isVercelRuntime = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
/** Cached Nest-backed Express app for Vercel (same pattern as `api/[...route].ts` in the monorepo). */
let vercelExpressApp = null;
async function getVercelExpressApp() {
    if (vercelExpressApp) {
        return vercelExpressApp;
    }
    const expressApp = (0, express_1.default)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp), { bufferLogs: true });
    await (0, configure_app_1.configureApp)(app, { useGlobalPrefix: true });
    await app.init();
    vercelExpressApp = expressApp;
    return expressApp;
}
/**
 * Vercel may treat `src/main` as the serverless entry; a default export is required
 * (see "No exports found in module" / "Did you forget to export a function or a server?").
 */
async function vercelHandler(request, response) {
    const server = await getVercelExpressApp();
    server(request, response);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true
    });
    await (0, configure_app_1.configureApp)(app, { useGlobalPrefix: true });
    const port = Number(process.env.PORT ?? 3000);
    console.log(`Server is running on port ${port}`);
    await app.listen(port);
}
if (!isVercelRuntime) {
    void bootstrap();
}
//# sourceMappingURL=main.js.map