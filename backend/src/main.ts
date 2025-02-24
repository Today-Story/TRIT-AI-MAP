import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors({
      origin: ['https://trit.framer.ai', 'http://localhost:5173'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization', // '*' 대신 명시적으로 설정
      credentials: true, // 쿠키/인증 정보를 포함한 요청 허용
  });

  // 세션 미들웨어 추가
  app.use(
      session({
          secret: process.env.SESSION_SECRET || 'default-secret',
          resave: false,
          saveUninitialized: false,
          cookie: {
              maxAge: 3600000, // 예: 1시간
              secure: true, // HTTPS 사용 시 true로 변경
              sameSite: 'none'
        },
      }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
      .setTitle('TRIT-AI-MAP API 문서')
      .setDescription('TRIT-AI-MAP API 문서')
      .setVersion('1.0')
      .addTag('contents')
      .addTag('business')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
