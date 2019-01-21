import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType() // turns User entity into a graphql object type
@Entity()
export class User extends BaseEntity {
    // @Field() tells graphql which fields to expose to be query-able
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number; 

    @Field()
    @Column()
    nickName: string;

    @Field()
    @Column('text', { unique: true })
    email: string;

    @Column()
    password: string;

    // in absence of the @Field() decorator, this field will only
    // be accessable on the server side and will not show up in
    // graphql schema.
    @Column('bool', { default: false })
    confirmed: boolean;
}
