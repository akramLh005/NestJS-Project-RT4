import { IsEnum, IsOptional } from "class-validator";
import { Status } from "../enums/status.enum";

export class ParamsDTO {
    @IsOptional()
    name: string;

    @IsOptional()
    description: string;

    @IsEnum(Status)
    state: string;
}