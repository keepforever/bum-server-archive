import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";
import { Deck } from './Deck'

@ObjectType() // turns User entity into a graphql object type
@Entity()
export class Vote extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    quality: boolean;

    @Column()
    userId: number;

    @Column()
    deckId: number;

    @ManyToOne(() => Deck, deck => deck.votes)
    @JoinColumn()
    deck: Deck;

    @ManyToOne(() => User, user => user.votes)
    user: User;

}
