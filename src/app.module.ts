import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { PayuModule } from './payu/payu.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [PayuModule, HttpModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
