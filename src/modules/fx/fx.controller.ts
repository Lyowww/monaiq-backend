import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FxService } from './fx.service';

@ApiTags('FX')
@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Get('bank-rates')
  @ApiOperation({
    summary: 'Indicative AMD exchange rates (aggregated bank middle for USD/EUR/RUB, scaled official refs for other majors)'
  })
  bankRates() {
    return this.fxService.getBankFxRates();
  }
}
