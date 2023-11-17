import { IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";


export class AddTodoDto {
  @IsNotEmpty({ message: 'must not be empty !' })
  @MinLength(3, { message: 'min lenght is 3 chars' })
  @MaxLength(10, { message: 'max lenght is 10 chars' })
  name: string;

  @IsNotEmpty({ message: 'must not be empty !' })
  @MinLength(10, { message: 'min lenght is 10 chars' })
  description: string;

  @IsOptional()
  userId: number;

}