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
        ): Promise<Deck[] | undefined> {
        if (!ctx.req.session!.userId) {
            return undefined;
        }

        const userId = ctx.req.session!.userId;

        const decks = await Deck.find({where: {userId} })

        console.log(decks);

        return decks
    }
}
