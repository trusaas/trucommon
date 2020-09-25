import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { GravatarDirective } from 'src/app/shared/directives/gravatar.directive';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { TagInputModule } from 'ngx-chips';
@NgModule({
  declarations: [
    GravatarDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconsProviderModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    NzNotificationModule,
    IconsProviderModule,
    NzToolTipModule,
    NzResultModule,
    NzSkeletonModule,
    NzMessageModule,
    NzAlertModule,
    GravatarDirective,
    NzAvatarModule,
    NzPopoverModule,
    NzSpinModule,
    NzBreadCrumbModule,
    NzCardModule,
    NzPageHeaderModule,
    NzListModule,
    ScrollingModule,
    DragDropModule,
    NzTabsModule,
    NzTableModule,
    NzSwitchModule,
    NzDropDownModule,
    NzBadgeModule,
    NzSelectModule,
    TagInputModule,
    NzAffixModule,
    NzDrawerModule,
  ]
})
export class SimpleFormCommonNzModule { }
