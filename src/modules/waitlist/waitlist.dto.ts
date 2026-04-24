import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class WaitlistJoinDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  email!: string;
}
