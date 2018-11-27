import { Body, Controller, Post, Request } from '@nestjs/common';
import { PayService } from '../../services/pay/pay.service';
import { CreateToken, PayToken } from '../../models';

@Controller('payu/pay')
export class PayController {
    constructor(private payService: PayService) {}

    @Post('create-token')
    async createToken(@Body() data: CreateToken) {
        return await this.payService.createToken(data);
    }

    @Post('token')
    async payWithToken(@Body() data: PayToken, @Request() req) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const agent = req.get('User-Agent');
        return await this.payService.payWithToken(data, ip, agent);
    }
}
