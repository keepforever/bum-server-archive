import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema, formatArgumentValidationError } from 'type-graphql';
import Express from 'express';
import { createConnection } from 'typeorm';
import session from 'express-session';
// helper function to create the RedisStore
import connectRedis from 'connect-redis';
// instantiated in a seperate file in the src dir
import { redis } from './redis';
import cors from 'cors';
// config constants
import { cookieName } from '../src/modules/constants/cookieName';
// Resolvers
import { RegisterResolver } from './modules/user/Register';
import { LoginResolver } from './modules/user/Login';
import { MeResolver } from './modules/user/Me';
import { ConfirmUserResolver } from './modules/user/ConfirmUser';
import { ForgotPasswordResolver } from './modules/user/ForgotPassword';
import { ChangePasswordResolver } from './modules/user/ChangePassword';
import { LogoutResolver } from './modules/user/Logout';
import { CreateDeckResolver } from './modules/user/CreateDeck';
import { MyDecksResolver } from './modules/deck/MyDecks';

const main = async () => {
    // createConnection reads from ormconfig.json
    await createConnection();
    // ApolloServer constructor requires schema. 
    const schema = await buildSchema({
        resolvers: [
            LogoutResolver,
            ChangePasswordResolver,
            RegisterResolver, 
            LoginResolver, 
            MeResolver, 
            ConfirmUserResolver,
            ForgotPasswordResolver,
            CreateDeckResolver,
            MyDecksResolver
        ],
        authChecker: ({ context: { req } }) => {
             return !!req.session.userId
        },
    });

    const apolloServer = new ApolloServer({
        schema,
        formatError: formatArgumentValidationError,
        context: ({ req, res }: any) => ({ req, res }),
    });

    // instantiate application
    const app = Express();

    // connnect Redis
    const RedisStore = connectRedis(session);

    app.use(
        cors({
            credentials: true,
            // 'origin' set to host that we expect our frontend to be at
            origin: 'http://localhost:3000',
        }),
    );

    // we want the session to be applied before we hit the resolvers.
    app.use(
        session({
            store: new RedisStore({
                client: redis as any, // 'as any' for typescript
            }),
            // name for our cookie
            name: cookieName,
            // this should be an enviornment variable, hard coded here for
            // simplicity.
            secret: 'aslkdfjoiq12312',
            resave: false,
            saveUninitialized: false,
            // cookie config
            cookie: {
                httpOnly: true,
                // this will evaluate to 'true' ONLY in production
                secure: process.env.NODE_ENV === 'production',
                // 7 years
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
            },
        }),
    );

    apolloServer.applyMiddleware({ 
        app,
        cors: false,
    });
    app.listen(4000, () => {
        console.log(`
        **************************************

            Server Started on http://localhost:4000/graphql
        
        **************************************
        `);
    });
};

main();
