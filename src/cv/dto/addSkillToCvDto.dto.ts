import { IsNotEmpty, IsNumber } from "class-validator";

export class addSkillToCvDto {
  @IsNotEmpty()
  @IsNumber()
  cv_id: number;

  @IsNotEmpty()
  @IsNumber()
  skill_id: number;
}