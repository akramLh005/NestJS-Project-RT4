import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";
import ErrorMessages from "../../utils/error.messages";


export class CreateCvDto {
    @IsNotEmpty()
    @IsString({message:ErrorMessages.nameRequired})
    name:string;

    @IsNotEmpty({message:ErrorMessages.firstnameRequired})
    @IsString()
    firstname: string;

    @IsNotEmpty({message:ErrorMessages.ageRequired})
    @IsNumber()
    age: number;

    @IsNotEmpty({message:ErrorMessages.cinRequired})
    @IsString()
    cin: string;

    @IsString()
    job:string;

    @IsString()
    path:string;

  userId: any;
  skills: any[];
}