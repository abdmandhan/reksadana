import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin'
  })
  username: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '12341234'
  })
  password: string
}
