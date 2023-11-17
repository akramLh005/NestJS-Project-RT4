
import {randEmail, randFirstName, randFullName, randJobTitle, randNumber, randPassword} from "@ngneat/falso";
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
import {CreateCvDto} from "../cv/dto/create-cv.dto";
import {CreateSkillDto} from "../skill/dto/create-skill.dto";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {SkillService} from "../skill/skill.service";
import {UserService} from "../user/user.service";




async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cvService = app.get(CvService);
  const userService = app.get(UserService);
  const skillService = app.get(SkillService);

  // Create a user
  const userDto = new CreateUserDto();
  userDto.username = randFullName();
  userDto.email = randEmail();
  userDto.password = randPassword();
  const user = await userService.create(userDto); // Create user

  // creation des skills ( exps )
 const skillsData = [
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'Docker',
  'AWS',
  'Git',
  'SQL',
  'NoSQL',
  'TypeScript'
];

  const skillsPromises = skillsData.map(async (designation) => {
  // Check if the skill already exists
  const existingSkill = await skillService.findByDesignation(designation);
  if (!existingSkill) {
    const skillDto = new CreateSkillDto();
    skillDto.designation = designation;
    return skillService.create(skillDto);
  } else {
    return existingSkill;
  }
});

const skills = await Promise.all(skillsPromises);

  // Creer CVs and associate them with the user and skills
  for (let i = 0; i < 3; i++) {
    const cvData = new CreateCvDto();
    cvData.name = randFullName();
    cvData.firstname = randFirstName();
    cvData.job = randJobTitle();
    cvData.age = randNumber()%60;
    cvData.cin = randNumber({ min: 10000000, max: 99999999 }).toString();
    cvData.path = 'path/to/cv';

    //association
    const createdCv = await cvService.create(cvData);
    await cvService.addUserToCv(createdCv.id, user.id);


    await cvService.addSkillsToCv(createdCv.id, skills.map(skill => skill.id));

  }

  await app.close();
}

bootstrap()
  .then(() => console.log('Seeding completed successfully.'))
  .catch((error) => console.error('Seeding failed:', error));
