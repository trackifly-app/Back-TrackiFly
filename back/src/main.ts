import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import * as dns from "dns";

async function bootstrap() {
  // Forzar a Node.js a priorizar conexiones IPv4 sobre IPv6 (Corrige ENETUNREACH en SMTP)
  dns.setDefaultResultOrder("ipv4first");

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: ["http://localhost:3000", "https://front-tracki-fly.vercel.app"],
    credentials: true,
    //permite conexion con front
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Mi API")
    .setDescription("Documentación de la API")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
