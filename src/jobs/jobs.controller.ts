import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage("Create a new job")
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return await this.jobsService.create(createJobDto, user);
  }

  @Get()
  @ResponseMessage("Fetch list Job with Paginate")
  findAll(
    @Query("current") currentPage: string, // const currentPage = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string // get all  req.query : page, limit
    ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  } 

  @Get(':id')
  @ResponseMessage("Fetch job by id")
  async findOne(@Param('id') id: string) {
    return await this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a job")
  update(
    @Param('id') id: string, 
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a job")
  remove(
    @Param('id') id: string, 
    @User() user: IUser
    ) {
    return this.jobsService.remove(id, user);
  }
}
