import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/app/utils/pagination.dto';


export class FilterTruckDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  brand?: string;

  @IsOptional()
  @IsString()
  paint?: string;
}
