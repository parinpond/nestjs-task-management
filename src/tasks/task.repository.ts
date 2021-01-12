import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-dto';
import { TaskStatus } from './task-status.eum';
import { Task } from './task.entity';
import { InternalServerErrorException, Logger} from '@nestjs/common';
@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    private logger = new Logger('TaskRepository');
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        if (status) {
          query.andWhere('task.status = :status', { status });
        } 
        if (search) {
          query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        try{
          const tasks = await query.getMany();
          return tasks;
        }catch(error){
          this.logger.error(`""`);
          throw new InternalServerErrorException();
        }
        
      }
    async createTask(createTaskDto:CreateTaskDto):Promise<Task>{
        const{ title,description} =createTaskDto;
        const task =new Task();
        task.title =title;
        task.description=description;
        task.status=TaskStatus.OPEN;
        await task.save();
        return task;
    }
}