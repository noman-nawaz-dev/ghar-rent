"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const supabase_service_1 = require("./database/supabase.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: [
            configService.get('FRONTEND_URL', 'http://localhost:3000'),
            'http://localhost:3000',
            'https://localhost:3000',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Ghar Rent API')
        .setDescription('Property rental platform API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer('http://localhost:3001', 'Development server')
        .addTag('Authentication', 'Authentication endpoints')
        .addTag('Users', 'User management endpoints')
        .addTag('Properties', 'Property management endpoints')
        .addTag('Rental Requests', 'Rental request endpoints')
        .addTag('Upload', 'File upload endpoints')
        .addTag('AI Services', 'AI-powered features')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
    const supabaseService = app.get(supabase_service_1.SupabaseService);
    await supabaseService.onModuleDestroy();
    const port = configService.get('PORT', '3001');
    await app.listen(parseInt(port, 10));
    console.log(`🚀 Ghar Rent API is running on: http://localhost:${port}/api`);
    console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap().catch((error) => {
    console.error('❌ Error starting the application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map