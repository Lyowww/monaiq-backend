import { FxService } from './fx.service';
export declare class FxController {
    private readonly fxService;
    constructor(fxService: FxService);
    bankRates(): Promise<import("./fx.service").BankFxRatesResponse>;
}
