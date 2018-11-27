import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Module({
    imports: [HttpModule.register({
        timeout: 180000,
    })],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class CommonModule {}
