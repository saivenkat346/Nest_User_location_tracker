import { IsNotEmpty  } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  userName: string;
  isActive: boolean;
}
