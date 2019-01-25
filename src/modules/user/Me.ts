import { Resolver, Query, Ctx } from 'type-graphql';

import { User } from '../../entity/User';
import { Vote } from '../../entity/Vote';

import { MyContext } from '../../types/MyContext';

// resolver to fetch User data based on cookie attached to client's request
@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
        if (!ctx.req.session!.userId) {
            return undefined;
        }
        return User.findOne(ctx.req.session!.userId);
    }
    @Query(() => [Vote], { nullable: true })
    async myVotes(
        @Ctx() ctx: MyContext,
        // @Arg('userId') userId: number
      ): Promise<Vote[] | null> {
        if (!ctx.req.session!.userId) {
            return null;
        }

        const userId = ctx.req.session!.userId;

        const votes = await Vote.find({where: {userId} })

        return votes
    }
}
