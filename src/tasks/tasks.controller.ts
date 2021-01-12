import { Body, Controller, Get, Post,Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.eum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { Logger} from '@nestjs/common';
@Controller('tasks')
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService:TasksService){}
    @Get()
    getTasks(
        @Query(ValidationPipe) 
        filterDto: GetTasksFilterDto): Promise<Task[]> {
        this.logger.verbose(`Filter: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto);
    }
    @Get('/:id')
    getTaskById(@Param('id',ParseIntPipe) id:number):Promise<Task>{
        return this.tasksService.getTaskById(id);
    }
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto):Promise<Task>{
        return this.tasksService.createTask(createTaskDto);
    }
    @Delete('/:id')
    deleteTask(@Param('id',ParseIntPipe) id:number):Promise<void>{
        return this.tasksService.deleteTask(id);
    }
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }
}
