import { Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { GetReportsDto } from "./dto/get-reports.dto";
import { ReportResponse } from "./interfaces/report-response.interface";

@Controller("admin/reportes")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getReports(@Query() query: GetReportsDto): Promise<ReportResponse> {
    return this.reportsService.getReports(query.filter || "1d");
  }
}
