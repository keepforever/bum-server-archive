import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { Deck } from '../../entity/Deck';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class CreateDeckResolver {
    // nullable to 'true' because we want to return null if login credentials don't check out
    @Mutation(() => Deck, { nullable: true })
    async createDeck(
        @Arg('deckList') deckList: string,
        @Arg('name') name: string,
        @Arg('description') description: string,
        @Ctx() ctx: MyContext,
    ): Promise<Deck | null> {
        // make sure user is authenticated
        if (!ctx.req.session!.userId) {
            return null;
        }
        const user = await User.findOne(ctx.req.session!.userId);

        // if no user exists in database return null
        if (!user) {
            return null;
        }

        // if user not confirmed, return null
        if (!user.confirmed) {
            return null;
        }

        const deck = await Deck.create({
            deckList,
            name,
            description,
            userId: user.id,
        }).save();

        return deck;
    }
}
