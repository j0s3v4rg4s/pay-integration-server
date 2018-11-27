import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import * as admin from 'firebase-admin';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    root(): string {
        return 'live';
    }
}
