import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { MyContext } from '../../types/MyContext';
import { User } from '../../entity/User';
import { Vote } from '../../entity/Vote';
import { Deck } from '../../entity/Deck';

@Resolver()
export class VoteOnDeckResolver {
    @Mutation(() => Boolean, {nullable: true})
    async voteForDeck(
        @Arg('deckId') id: number,
        @Arg('quality') quality: boolean,
        @Ctx() ctx: MyContext,
    ): Promise<Boolean | null> {
        // make sure user is authenticated
        if (!ctx.req.session!.userId) {
            return null;
        }
        // get user from database
        const user = await User.findOne(ctx.req.session!.userId);

        // if no user exists in database return null
        if (!user || !user.confirmed) {
            return false;
        }

        let res;
        res = await Vote.find({ deckId: id})

        console.log('\n', 'res', '\n', '\n', res )
        let isAlreadyVoted: boolean = false;
        if(res.length !== 0) {
          res.forEach((v) => {
            if(v.userId === user.id) {
              isAlreadyVoted = true
            }
          })
        }

        if(isAlreadyVoted){
          return false
        }

        const vote = await Vote.create({
            quality,
            userId: user.id,
            deckId: id,
        }).save();

        // increment vote for deck on new vote creatoin.
        let deck = await Deck.findOne({id})
        if(vote && quality && deck){
          const newScore = deck.voteScore + 1
          await Deck.update({ id }, { voteScore: newScore });
        }

        if(vote && !quality && deck){
          const newScore = deck.voteScore - 1
          await Deck.update({ id }, { voteScore: newScore });
        }

        return !!vote;
    }
}
