import { ValidationErrors } from "../enums/errors.enum";
import { Status } from "../enums/status.enum";
import { IsEnum, IsNotEmpty, MinLength, MaxLength, IsString } from "class-validator";

export class UpdateTodoDto {
  @IsNotEmpty({ message: ValidationErrors.INVALID_NAME })
  @MinLength(3, { message: ValidationErrors.INVALID_NAME })
  @MaxLength(10, { message: ValidationErrors.INVALID_NAME })
  name: string;

  @IsEnum(Status, { message: ValidationErrors.INVALID_STATUS })
  state: Status;

  @IsString({ message: "description invalide" })
  @MinLength(10, { message: "taille invalide" })
  description?: string;
}