import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
    @Field()
    @Length(1, 255)
    nickName: string;

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: 'email already in use' })
    email: string;

    @Field()
    password: string;
}

// NOTE: isEmailAlreadyExist is an example of creating a 
// custom decorator for validation's sake. 