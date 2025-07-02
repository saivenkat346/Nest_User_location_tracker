import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Location } from './location.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];

  @Column({ default: false })
  isActive: boolean;
}
