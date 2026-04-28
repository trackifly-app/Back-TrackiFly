import { IsIn, IsOptional } from "class-validator";

export class GetReportsDto {
  @IsOptional()
  @IsIn(["1h", "1d", "7d", "1m", "historic"])
  filter?: "1h" | "1d" | "7d" | "1m" | "historic" = "1d";
}
