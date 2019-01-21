import { Resolver, Query, Ctx } from 'type-graphql';

import { User } from '../../entity/User';
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
}
