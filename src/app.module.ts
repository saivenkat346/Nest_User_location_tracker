import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Location } from './user/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'Saisam643@',
      database: 'user_location_tracker',
      entities: [User,Location],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
