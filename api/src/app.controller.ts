import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import mongoose from 'mongoose'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    // __MONGO_URI__ is set during e2e testing
    const mongoUri = (global as any).__MONGO_URI__ || 'mongodb://root:root@localhost:27017/'
    mongoose.connect(mongoUri)
    
    return {
      message: this.appService.getHello()
    }
  }
}
