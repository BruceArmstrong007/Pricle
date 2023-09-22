import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RouteRequest {
  @IsString()
  @IsNotEmpty()
  route: string;

  @IsOptional()
  @IsNotEmpty()
  data?: any;
}

export class AuthRouteRequest {
  @IsString()
  @IsNotEmpty()
  route: string;

  @IsOptional()
  @IsNotEmpty()
  data?: any;

  @IsNotEmpty()
  @IsString()
  Authentication?: string;
}

export class RMQRequest {
  @IsNotEmpty()
  data: any;
}

export class AuthRMQRequest {
  @IsNotEmpty()
  data: any;

  @IsNotEmpty()
  @IsString()
  Authentication: string;
}
