import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SupabaseService } from './database/supabase.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Enable CORS
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

  // Global API prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert strings to numbers/booleans when possible
      },
    }),
  );

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Supabase shutdown hooks
  const supabaseService = app.get(SupabaseService);
  await supabaseService.onModuleDestroy();

  const port = configService.get<string>('PORT', '3001');
  await app.listen(parseInt(port, 10));

  console.log(`🚀 Ghar Rent API is running on: http://localhost:${port}/api`);
  console.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}

bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});
