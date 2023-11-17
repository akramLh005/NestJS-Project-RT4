
import {IsOptional, IsString ,IsNumber } from "class-validator";
import { Type } from "class-transformer";


export class UpdateCvDto  {
    @IsString()
    @IsOptional()
    name:string;

    @IsOptional()
    @IsString()
    firstname: string;

    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    age: number;

    @IsOptional()
    @IsString()
    cin: string;

    @IsString()
    @IsOptional()
    job:string;

    @IsString()
    @IsOptional()
    path:string;
}

