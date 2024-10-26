import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { ReflectionService } from '@grpc/reflection';

async function bootstrap() {
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'order',
      protoPath: join(__dirname, './proto/order.proto'),
      url: 'localhost:5000', // Specify the port here
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  });

  await app.listen();
}
bootstrap();
