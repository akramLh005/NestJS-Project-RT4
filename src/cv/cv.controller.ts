import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from "@nestjs/common";
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from "./dto/update-cv.dto";

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) { }

  @Post('add')
  create(
    @Body() createCvDto: CreateCvDto,
    @Req() request: Request
  ) {
    // const userId = request['UserId'];
    return this.cvService.create(createCvDto);
  }

  @Get('list')
  async findAll() {
    return await this.cvService.getAllCvs();
  }

  @Patch(':id')
  update(@Param('id' , ParseIntPipe ) id : number, @Body() updateCvDto: UpdateCvDto) {
    return this.cvService.updateCv(id, updateCvDto);
  }

  @Patch()
  async updateCv2(
    @Body() updateObject
  ) {
    const {updateCriteria, updateCvDto} = updateObject
    return await this.cvService.updateCvViaCriteria(updateCriteria, updateCvDto);
  }


  @Delete(':id')
  async deleteCv(
    @Param('id', ParseIntPipe) id,
  ) {
    return this.cvService.removeCv(id);
  }



}