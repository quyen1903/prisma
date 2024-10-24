import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UsernameValidator } from "../shared/validators/username.validator";
import { PasswordValidator } from "../shared/validators/password.validator";
export class RegisterDTO {
    @UsernameValidator()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @PasswordValidator()
    password: string;

    constructor({name, email, password}:{name: string, email: string, password: string}) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export class LoginDTO {
    @IsEmail()
    @IsNotEmpty()
    @IsString()    
    email: string;
  
    @PasswordValidator()
    password: string;

    constructor({email, password}:{email: string, password: string}){
        this.email = email;
        this.password = password;
    }
  }
  