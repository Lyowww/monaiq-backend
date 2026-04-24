import { IsIn, IsString, MinLength } from 'class-validator';

export class AdminTranslateBodyDto {
  @IsString()
  @MinLength(1)
  text!: string;

  @IsIn(['en', 'hy'])
  to!: 'en' | 'hy';
}
