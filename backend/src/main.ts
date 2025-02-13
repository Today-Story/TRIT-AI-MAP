import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  //swagger 설정
  const config = new DocumentBuilder()
      .setTitle('TRIT-AI-MAP API 문서')
      .setDescription('TRIT-AI-MAP API 문서')
      .setVersion('1.0')
      .addTag('contents')
      .addTag('products')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
