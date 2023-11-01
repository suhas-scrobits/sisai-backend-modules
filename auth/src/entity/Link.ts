import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { CustomBaseEntity } from "./CustomBaseEntity";

@Entity()
export class Link extends CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ length: 500 })
  link: string;
}
