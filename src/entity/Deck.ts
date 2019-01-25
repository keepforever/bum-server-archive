import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";
import { Vote } from './Vote';

@ObjectType() // turns User entity into a graphql object type
@Entity()
export class Deck extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column()
    deckList: string;

    @Field()
    @Column('int', {default: 0})
    voteScore: number;

    @Column()
    userId: number;

    @Field(() => Vote, {nullable: true})
    @OneToMany(() => Vote, vote => vote.deck)
    votes: Vote[];

    @ManyToOne(() => User, user => user.decks)
    user: User;
}
