import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Deck } from './Deck';

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

    // TODO: switch default to 'false' to implement 
    // confirmation email pattern. 
    @Column('bool', { default: true })
    confirmed: boolean;

    @Field(() => Deck)
    @OneToMany(() => Deck, deck => deck.user)
    decks: Deck[];
}
