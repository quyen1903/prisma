import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UsernameValidator } from "../shared/validators/username.validator";
import { PasswordValidator } from "../shared/validators/password.validator";
enum Sex{
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}
export class UserRegisterDTO {
    @UsernameValidator()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @PasswordValidator()
    password: string;
    
    @IsString()
    phone: string
    @IsString()
    sex: Sex

    @IsString()
    avatar: string

    @IsString()
    dateOfBirth: string


    constructor(
        {name, email, password, phone, sex}:
        {name: string, email: string, password: string,phone: string, sex: Sex}){
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.sex = sex;
    }
}

export class UserLoginDTO {
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
  