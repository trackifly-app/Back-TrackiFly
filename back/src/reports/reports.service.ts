import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, MoreThanOrEqual } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Company } from "../companies/entities/company.entity";
import { Order } from "../orders/entities/order.entity";
import { OrderStatus } from "../common/enums/order-status.enum";
import { ReportResponse } from "./interfaces/report-response.interface";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getReports(
    filter: "1h" | "1d" | "7d" | "1m" | "historic" = "1d",
  ): Promise<ReportResponse> {
    const now = new Date();

    // Calcular rangos de tiempo
    const { currentStart, currentEnd, previousStart, previousEnd, interval } =
      this.getTimeRanges(now, filter);

    // Obtener datos del período actual
    const [currentUsers, currentCompanies, currentOrders] = await Promise.all([
      this.usersRepository.count({
        where: {
          created_at: Between(currentStart, currentEnd),
          is_active: true,
        },
      }),
      this.companiesRepository.count({
        where: { user: { created_at: Between(currentStart, currentEnd) } },
      }),
      this.ordersRepository.find({
        where: { created_at: Between(currentStart, currentEnd) },
        relations: ["user"],
      }),
    ]);

    // Obtener datos del período anterior
    const [previousUsersCount, previousCompaniesCount, previousOrdersList] =
      await Promise.all([
        this.usersRepository.count({
          where: {
            created_at: Between(previousStart, previousEnd),
            is_active: true,
          },
        }),
        this.companiesRepository.count({
          where: { user: { created_at: Between(previousStart, previousEnd) } },
        }),
        this.ordersRepository.find({
          where: { created_at: Between(previousStart, previousEnd) },
          relations: ["user"],
        }),
      ]);

    // Procesar órdenes del período actual
    const orders = {
      delivered: currentOrders.filter((o) => o.status === OrderStatus.Completed)
        .length,
      started: currentOrders.filter((o) => o.status === OrderStatus.Shipped)
        .length,
      canceled: currentOrders.filter((o) => o.status === OrderStatus.Cancelled)
        .length,
    };

    // Procesar órdenes del período anterior
    const previousOrders = {
      delivered: previousOrdersList.filter(
        (o) => o.status === OrderStatus.Completed,
      ).length,
      started: previousOrdersList.filter(
        (o) => o.status === OrderStatus.Shipped,
      ).length,
      canceled: previousOrdersList.filter(
        (o) => o.status === OrderStatus.Cancelled,
      ).length,
    };

    // Generar datos para gráficos
    const { usersPerPeriod, companiesPerPeriod, labels } =
      await this.generateChartData(currentStart, currentEnd, interval, filter);

    return {
      totalUsers: currentUsers,
      previousUsers: previousUsersCount,
      totalCompanies: currentCompanies,
      previousCompanies: previousCompaniesCount,
      orders,
      previousOrders,
      usersPerPeriod,
      companiesPerPeriod,
      labels,
    };
  }

  private getTimeRanges(now: Date, filter: string): any {
    let currentStart: Date;
    let currentEnd: Date;
    let previousStart: Date;
    let previousEnd: Date;
    let interval: string;

    switch (filter) {
      case "1h":
        // Última hora, en intervalos de minutos (12 intervalos de 5 minutos)
        currentStart = new Date(now.getTime() - 60 * 60 * 1000);
        currentEnd = now;
        previousStart = new Date(currentStart.getTime() - 60 * 60 * 1000);
        previousEnd = currentStart;
        interval = "minute";
        break;

      case "1d":
        // Último día, en intervalos de horas (24 horas)
        currentStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        currentEnd = now;
        previousStart = new Date(currentStart.getTime() - 24 * 60 * 60 * 1000);
        previousEnd = currentStart;
        interval = "hour";
        break;

      case "7d":
        // Últimos 7 días, en intervalos de días
        currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        currentEnd = now;
        previousStart = new Date(
          currentStart.getTime() - 7 * 24 * 60 * 60 * 1000,
        );
        previousEnd = currentStart;
        interval = "day";
        break;

      case "1m":
        // Último mes (30 días), en intervalos de días
        currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        currentEnd = now;
        previousStart = new Date(
          currentStart.getTime() - 30 * 24 * 60 * 60 * 1000,
        );
        previousEnd = currentStart;
        interval = "day";
        break;

      case "historic":
      default:
        // Todo el historial, en intervalos de meses
        currentStart = new Date("2020-01-01");
        currentEnd = now;
        previousStart = new Date(0);
        previousEnd = new Date(0);
        interval = "month";
        break;
    }

    return { currentStart, currentEnd, previousStart, previousEnd, interval };
  }

  private async generateChartData(
    start: Date,
    end: Date,
    interval: string,
    filter: string,
  ): Promise<{
    usersPerPeriod: number[];
    companiesPerPeriod: number[];
    labels: string[];
  }> {
    const usersPerPeriod: number[] = [];
    const companiesPerPeriod: number[] = [];
    const labels: string[] = [];

    if (interval === "minute") {
      // 12 intervalos de 5 minutos
      for (let i = 0; i < 12; i++) {
        const periodStart = new Date(start.getTime() + i * 5 * 60 * 1000);
        const periodEnd = new Date(periodStart.getTime() + 5 * 60 * 1000);

        const userCount = await this.usersRepository.count({
          where: {
            created_at: Between(periodStart, periodEnd),
            is_active: true,
          },
        });

        const companyCount = await this.companiesRepository.count({
          where: { user: { created_at: Between(periodStart, periodEnd) } },
        });

        usersPerPeriod.push(userCount);
        companiesPerPeriod.push(companyCount);
        labels.push(this.formatLabel(periodStart, interval));
      }
    } else if (interval === "hour") {
      // 24 horas
      for (let i = 0; i < 24; i++) {
        const periodStart = new Date(start.getTime() + i * 60 * 60 * 1000);
        const periodEnd = new Date(periodStart.getTime() + 60 * 60 * 1000);

        const userCount = await this.usersRepository.count({
          where: {
            created_at: Between(periodStart, periodEnd),
            is_active: true,
          },
        });

        const companyCount = await this.companiesRepository.count({
          where: { user: { created_at: Between(periodStart, periodEnd) } },
        });

        usersPerPeriod.push(userCount);
        companiesPerPeriod.push(companyCount);
        labels.push(this.formatLabel(periodStart, interval));
      }
    } else if (interval === "day") {
      // Desde start hasta end, cada día
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      for (let i = 0; i < diffDays; i++) {
        const periodStart = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        const periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000);

        const userCount = await this.usersRepository.count({
          where: {
            created_at: Between(periodStart, periodEnd),
            is_active: true,
          },
        });

        const companyCount = await this.companiesRepository.count({
          where: { user: { created_at: Between(periodStart, periodEnd) } },
        });

        usersPerPeriod.push(userCount);
        companiesPerPeriod.push(companyCount);
        labels.push(this.formatLabel(periodStart, interval));
      }
    } else if (interval === "month") {
      // Meses
      const startDate = new Date(start);
      const endDate = new Date(end);

      while (startDate < endDate) {
        const periodStart = new Date(startDate);
        const periodEnd = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );

        const userCount = await this.usersRepository.count({
          where: {
            created_at: Between(periodStart, periodEnd),
            is_active: true,
          },
        });

        const companyCount = await this.companiesRepository.count({
          where: { user: { created_at: Between(periodStart, periodEnd) } },
        });

        usersPerPeriod.push(userCount);
        companiesPerPeriod.push(companyCount);
        labels.push(this.formatLabel(periodStart, interval));

        startDate.setMonth(startDate.getMonth() + 1);
      }
    }

    return { usersPerPeriod, companiesPerPeriod, labels };
  }

  private formatLabel(date: Date, interval: string): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "UTC",
    };

    if (interval === "minute") {
      return date.toLocaleTimeString("es-ES", {
        ...options,
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (interval === "hour") {
      return date.toLocaleTimeString("es-ES", { ...options, hour: "2-digit" });
    } else if (interval === "day") {
      return date.toLocaleDateString("es-ES", {
        ...options,
        day: "2-digit",
        month: "2-digit",
      });
    } else if (interval === "month") {
      return date.toLocaleDateString("es-ES", {
        ...options,
        month: "short",
        year: "2-digit",
      });
    }

    return date.toISOString();
  }
}
