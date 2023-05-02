import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Complaint } from '../complaint/entities/complaint.entity';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { complaintStatus } from 'src/common/enums/complaint-status';
import { Item } from '../item/entities/item.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { Category } from '../category/entities/category.entity';
import { getMonthName } from 'src/common/constants/month-data';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getSuperAdminDashboardData(): Promise<any> {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const organizations = await this.organizationRepository
      .createQueryBuilder('organization')
      .select('COUNT(*)', 'totalQuantity')
      .addSelect(
        `COUNT(*) FILTER (WHERE DATE_TRUNC('month', "createdDate") = DATE_TRUNC('month', NOW()))`,
        'thisMonthQuantity',
      )
      .getRawOne();

    const admins = await this.userRepository
      .createQueryBuilder('user')
      .select('COUNT(*)', 'totalQuantity')
      .addSelect(
        `COUNT(*) FILTER (WHERE DATE_TRUNC('month', "createdDate") = DATE_TRUNC('month', NOW()))`,
        'thisMonthQuantity',
      )
      .where('user.roleId = 2')
      .getRawOne();

    const pendingComplaints = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('COUNT(*)', 'totalQuantity')
      .addSelect(
        `COUNT(*) FILTER (WHERE DATE_TRUNC('month', "createdDate") = DATE_TRUNC('month', NOW()))`,
        'thisMonthQuantity',
      )
      .where('complaint.status = :status', { status: complaintStatus.PENDING })
      .getRawOne();

    const resolvedComplaints = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('COUNT(*)', 'totalQuantity')
      .addSelect(
        `COUNT(*) FILTER (WHERE DATE_TRUNC('month', "createdDate") = DATE_TRUNC('month', NOW()))`,
        'thisMonthQuantity',
      )
      .where('complaint.status = :status', { status: complaintStatus.RESOLVED })
      .getRawOne();

    const superAdminDashboardData = [
      {
        name: 'Organizations',
        totalCount: organizations.totalQuantity,
        monthlyCount: `${parseInt(
          organizations.thisMonthQuantity,
        )} new organizations this month`,
      },
      {
        name: 'Admins',
        totalCount: admins.totalQuantity,
        monthlyCount: `${parseInt(
          admins.thisMonthQuantity,
        )} new admins this month`,
      },
      {
        name: 'Pending Complaints',
        totalCount: pendingComplaints.totalQuantity,
        monthlyCount: `${parseInt(
          pendingComplaints.thisMonthQuantity,
        )} new pending complaints this month`,
      },
      {
        name: 'Resolved Complaints',
        totalCount: resolvedComplaints.totalQuantity,
        monthlyCount: `${parseInt(
          resolvedComplaints.thisMonthQuantity,
        )} new complaints this month`,
      },
    ];

    return superAdminDashboardData;
  }

  async getAdminDashboardData(user: User): Promise<any> {
    const currentDate = new Date();

    const items = await this.itemRepository
      .createQueryBuilder('item')
      .select('COUNT(*)', 'totalQuantity')
      .addSelect(
        `COUNT(*) FILTER (WHERE DATE_TRUNC('month', "createdDate") = DATE_TRUNC('month', NOW()))`,
        'thisMonthQuantity',
      )
      .where('item.organizationId = :organizationId', {
        organizationId: user.organizationId,
      })
      .getRawOne();

    const employees = await this.userRepository
      .createQueryBuilder('user')
      .select('COUNT(*)', 'totalQuantity')
      .addSelect(
        `COUNT(*) FILTER (WHERE DATE_TRUNC('month', "createdDate") = DATE_TRUNC('month', NOW()))`,
        'thisMonthQuantity',
      )
      .where('user.roleId = 3')
      .where('user.organizationId = :organizationId', {
        organizationId: user.organizationId,
      })
      .getRawOne();

    const vendors = await this.vendorRepository
      .createQueryBuilder('vendor')
      .select('COUNT(*)', 'totalQuantity')
      .addSelect(
        `COUNT(*) FILTER (WHERE DATE_TRUNC('month', "createdDate") = DATE_TRUNC('month', NOW()))`,
        'thisMonthQuantity',
      )
      .where('vendor.organizationId = :organizationId', {
        organizationId: user.organizationId,
      })
      .getRawOne();

    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .select('COUNT(*)', 'totalQuantity')
      .addSelect(
        `COUNT(*) FILTER (WHERE DATE_TRUNC('month', "createdDate") = DATE_TRUNC('month', NOW()))`,
        'thisMonthQuantity',
      )
      .where('category.parentId IS NULL')
      .where('category.organizationId = :organizationId', {
        organizationId: user.organizationId,
      })
      .getRawOne();

    const adminDashboardData = [
      {
        name: 'Employees',
        totalCount: employees.totalQuantity,
        monthlyCount: `${parseInt(
          employees.thisMonthQuantity,
        )} new employees this month`,
      },
      {
        name: 'Inventory items',
        totalCount: items.totalQuantity,
        monthlyCount: `${parseInt(
          items.thisMonthQuantity,
        )} new item this month`,
      },
      {
        name: 'Vendors',
        totalCount: vendors.totalQuantity,
        monthlyCount: `${parseInt(
          vendors.thisMonthQuantity,
        )} new vendors this month`,
      },
      {
        name: 'Categories',
        totalCount: categories.totalQuantity,
        monthlyCount: `${parseInt(
          categories.thisMonthQuantity,
        )} new categories this month`,
      },
    ];

    return adminDashboardData;
  }

  async getSuperAdminGraphData() {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const adminsMonthData = Array.from({ length: 12 }, (_, i) => [
      monthNames[i],
      0,
    ]);

    const organizationMonthData = Array.from({ length: 12 }, (_, i) => [
      monthNames[i],
      0,
    ]);

    const currentYear = new Date().getFullYear();

    const organizations = await this.organizationRepository
      .createQueryBuilder('organization')
      .select('COUNT(*) as count')
      .addSelect(`EXTRACT(MONTH FROM "createdDate") as month`)
      .where(`EXTRACT(YEAR FROM "createdDate") = ${currentYear}`)
      .groupBy(`EXTRACT(MONTH FROM "createdDate")`)
      .getRawMany();

    const admins = await this.userRepository
      .createQueryBuilder('user')
      .select('COUNT(*) as count')
      .addSelect(`EXTRACT(MONTH FROM "createdDate") as month`)
      .where(`EXTRACT(YEAR FROM "createdDate") = ${currentYear}`)
      .groupBy(`EXTRACT(MONTH FROM "createdDate")`)
      .where('user.roleId = 2')
      .getRawMany();

    organizations.forEach((org) => {
      const month = parseInt(org.month, 10) - 1;
      organizationMonthData[month][1] = org.count;
    });

    admins.forEach((admin) => {
      const month = parseInt(admin.month, 10) - 1;
      adminsMonthData[month][1] = admin.count;
    });

    return {
      organizationGraphData: organizationMonthData,
      adminsGraphData: adminsMonthData,
    };
  }

  private async getInventoryDataByMonth(user: User) {
    const currentYear = new Date().getFullYear();

    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.item', 'item')
      .leftJoin('item.assignedTo', 'assignedTo')
      .select([
        'category.name as name',
        'COUNT(item.id) as count',
        'EXTRACT(MONTH FROM item.createdDate) as month',
        'SUM(CASE WHEN assignedTo.id IS NULL THEN 1 ELSE 0 END) as unassignedCount',
      ])
      .where(`EXTRACT(YEAR FROM item.createdDate) = ${currentYear}`)
      .andWhere('category.organizationId = :organizationId', {
        organizationId: user.organizationId,
      })
      .groupBy('category.id, month')
      .orderBy('category.id, month')
      .getRawMany();

    const inventoryData = {};

    for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
      const monthName = getMonthName(monthNumber);
      inventoryData[monthName] = [
        ['Category', 'Assigned', 'Unassigned', 'Quantity'],
      ];

      categories.forEach((category) => {
        if (parseInt(category.month, 10) === monthNumber) {
          const assignedCount =
            parseInt(category.count, 10) -
            parseInt(category.unassignedcount, 10);
          const unassignedCount = parseInt(category.unassignedcount, 10);
          const quantity = assignedCount + unassignedCount;

          inventoryData[monthName].push([
            category.name,
            assignedCount,
            unassignedCount,
            quantity,
          ]);
        }
      });

      if (inventoryData[monthName].length === 1) {
        inventoryData[monthName].push(['No Data in this month', 0, 0, 0]);
      }
    }

    return inventoryData;
  }

  async getAdminGraphData(user: User) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const complaintsMonthData = Array.from({ length: 12 }, (_, i) => [
      monthNames[i],
      0,
      0,
    ]);

    const currentYear = new Date().getFullYear();

    const resolvedComplaints = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('COUNT(*) as count')
      .addSelect(`EXTRACT(MONTH FROM "createdDate") as month`)
      .where(`EXTRACT(YEAR FROM "createdDate") = ${currentYear}`)
      .groupBy(`EXTRACT(MONTH FROM "createdDate")`)
      .where(`complaint.status = 'resolved'`)
      .getRawMany();

    const pendingComplaints = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('COUNT(*) as count')
      .addSelect(`EXTRACT(MONTH FROM "createdDate") as month`)
      .where(`EXTRACT(YEAR FROM "createdDate") = ${currentYear}`)
      .groupBy(`EXTRACT(MONTH FROM "createdDate")`)
      .where(`complaint.status = 'pending'`)
      .getRawMany();

    resolvedComplaints.forEach((resolvedComplaint) => {
      const month = parseInt(resolvedComplaint.month, 10) - 1;
      complaintsMonthData[month][2] = resolvedComplaint.count;
    });

    pendingComplaints.forEach((pendingComplaint) => {
      const month = parseInt(pendingComplaint.month, 10) - 1;
      complaintsMonthData[month][1] = pendingComplaint.count;
    });

    return {
      complaintsMonthData,
      inventoryMonthData: await this.getInventoryDataByMonth(user),
    };
  }
}
