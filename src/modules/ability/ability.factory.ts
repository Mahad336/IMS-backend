import { Injectable, Req, Type } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Item } from '../item/entities/item.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { Category } from '../category/entities/category.entity';
import { Complaint } from '../complaint/entities/complaint.entity';

import {
  defineAbility,
  InferSubjects,
  AbilityBuilder,
  Ability,
  AbilityClass,
  ExtractSubjectType,
  ConditionsMatcher,
  MatchConditions,
} from '@casl/ability';
import { UserRole } from 'src/common/enums/user-role.enums';
import { Request } from '../request/entities/request.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Item
      | typeof Vendor
      | typeof Category
      | typeof Complaint
      | typeof Organization
      | typeof Request
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;
const lambdaMatcher: ConditionsMatcher<MatchConditions> = (matchConditions) =>
  matchConditions;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    // Super Admin abilities
    if (user?.role?.name == UserRole.SUPER_ADMIN) {
      can(Action.Manage, 'all');
    }

    // Admin abilities
    if (user.role.name == UserRole.ADMIN) {
      can(Action.Create, [Item, Vendor, Category, Complaint, User]);
      can(Action.Update, User, {
        organizationId: user.organization.id,
      });
      can(Action.Delete, [Item, Vendor, Category, Complaint]);
      can(Action.Read, [Organization, Item, Category, Complaint, User, Vendor]);
    }

    // Employee abilities
    if (user.role.name == UserRole.EMPLOYEE) {
      can(Action.Create, [Complaint, Request], {
        organization: user.organization,
      });
      can(Action.Update, [Complaint, Request], {
        organization: user.organization,
      });
      cannot(Action.Update, User, {
        id: { $ne: user.id },
      }).because('You cannot update someone else');
      can(Action.Delete, [Complaint, Request], {
        organization: user.organization,
      });
      can(Action.Read, [User, Item, Complaint, Request]);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
