import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @ManyToOne((type) => User, (user) => user.locations)
  user: User;

  @Column({ type: 'simple-json' })
  location: { latitude: number; longitude: number };

  @Column({ type: 'simple-json' })
  path: Array<{ latitude: number; longitude: number }>;
}
