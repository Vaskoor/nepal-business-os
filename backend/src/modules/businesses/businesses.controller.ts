import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Post()
  create(@Body() dto: CreateBusinessDto) {
    return this.businessesService.create(dto);
  }
}
