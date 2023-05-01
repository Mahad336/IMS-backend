import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuardMiddleware } from 'src/auth/guards/auth-guard.middleware';
import { User } from '../user/entities/user.entity';
import { DashboardService } from './dashboard.service';
import { UserRole } from 'src/common/enums/user-role.enums';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuardMiddleware)
  async getDashboardData(@Req() req) {
    const user = req.user;
    switch (user?.role.name) {
      case UserRole.SUPER_ADMIN:
        return this.dashboardService.getSuperAdminDashboardData();
      case UserRole.ADMIN:
        return this.dashboardService.getAdminDashboardData(user);
      default:
        throw new HttpException('Invalid user role', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('/graph-data')
  @UseGuards(AuthGuardMiddleware)
  async getGraphData(@Req() req) {
    const user = req.user;
    switch (user?.role.name) {
      case UserRole.SUPER_ADMIN:
        return this.dashboardService.getSuperAdminGraphData();
      case UserRole.ADMIN:
        return this.dashboardService.getAdminGraphData(user);
      default:
        throw new HttpException('Invalid user role', HttpStatus.UNAUTHORIZED);
    }
  }
}
