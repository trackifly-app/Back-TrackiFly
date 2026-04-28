export interface ReportResponse {
  totalUsers: number;
  previousUsers: number;

  totalCompanies: number;
  previousCompanies: number;

  orders: {
    delivered: number;
    started: number;
    canceled: number;
  };

  previousOrders: {
    delivered: number;
    started: number;
    canceled: number;
  };

  usersPerPeriod: number[];
  companiesPerPeriod: number[];
  labels: string[];
}
