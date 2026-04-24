"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const configure_app_1 = require("./bootstrap/configure-app");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true
    });
    await (0, configure_app_1.configureApp)(app, { useGlobalPrefix: true });
    const port = Number(process.env.PORT ?? 3000);
    console.log(`Server is running on port ${port}`);
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map