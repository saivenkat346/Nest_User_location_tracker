import { Module } from '@nestjs/common';
import {User} from './entities/user.entity';
import { UserService } from './service/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Location])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
