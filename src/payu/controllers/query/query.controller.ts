import { Body, Controller, Post } from '@nestjs/common';
import { PayService } from '../../services/pay/pay.service';
import { PingData } from '../../models';

@Controller('payu/query')
export class QueryController {
    constructor(private payService: PayService) {}

    @Post('ping')
    async ping(@Body() data: PingData) {
        return await this.payService.ping(data);
    }

    @Post('web-hook')
    async webHook(@Body() data) {
        console.log(data);
        return 'ok';
    }
}
