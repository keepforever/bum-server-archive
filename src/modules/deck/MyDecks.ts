import { Resolver, Query, Ctx } from 'type-graphql';

import { Deck } from '../../entity/Deck';
import { MyContext } from '../../types/MyContext';

// resolver to fetch User data based on cookie attached to client's request
@Resolver()
export class MyDecksResolver {
    @Query(() => [Deck], { nullable: true })
    async myDecks(
        @Ctx() ctx: MyContext,
        // @Arg('userId') userId: number
      ): Promise<Deck[] | null> {
        if (!ctx.req.session!.userId) {
            return null;
        }

        const userId = ctx.req.session!.userId;

        const decks = await Deck.find({where: {userId} })

        console.log(decks);

        return decks
    }

    @Query(() => [Deck], { nullable: true })
    async allDecks(
        @Ctx() ctx: MyContext,
        // @Arg('userId') userId: number
      ): Promise<Deck[] | null> {
        if (!ctx.req.session!.userId) {
            return null;
        }

        const decks = await Deck.find()

        return decks
    }
}
