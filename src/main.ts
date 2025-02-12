import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  //swagger 설정
  const config = new DocumentBuilder()
      .setTitle('상품 API 문서')
      .setDescription('상품(Product) 관련 API 문서')
      .setVersion('1.0')
      .addTag('products')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
