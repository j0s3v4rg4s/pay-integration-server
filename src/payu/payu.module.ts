import { HttpModule, Module } from '@nestjs/common';
import { QueryController } from './controllers/query/query.controller';
import { PayService } from './services/pay/pay.service';
import { CommonModule } from '../common/common.module';
import { PayController } from './controllers/pay/pay.controller';

@Module({
    imports: [HttpModule, CommonModule],
    controllers: [QueryController, PayController],
    providers: [PayService],
})
export class PayuModule {}
