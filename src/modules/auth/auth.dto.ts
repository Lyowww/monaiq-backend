import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Strongpass1' })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
    minLowercase: 1
  })
  password!: string;

  @ApiProperty({ example: 'Ani' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({ example: 'Sargsyan' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @ApiProperty({ example: '2004-08-14' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ example: 'iPhone 16 Pro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  deviceName!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  /** Login accepts any non-empty secret; strength is enforced on register only. */
  @ApiProperty({ example: 'Strongpass1' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'iPhone 16 Pro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  deviceName!: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
