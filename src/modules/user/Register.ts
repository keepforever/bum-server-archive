import { Resolver, Query, Mutation, Arg, Authorized, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../middleware/logger";
import { sendEmail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";


@Resolver()
export class RegisterResolver {
    @Authorized()
    @Query(() => String)
    async hello() {
        return 'Hello World!';
    }

    @UseMiddleware(isAuth, logger)
    @Query(() => String)
    async goodbye() {
        return 'Goodbye Cruel World!';
    }

    @Mutation(() => User)
    async register(@Arg('data')
    {
        email,
        nickName,
        password,
    }: RegisterInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            nickName,
            email,
            password: hashedPassword,
        }).save();

        await sendEmail(user.email,  await createConfirmationUrl(user.id));

        return user;   
    }
}