import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser())

  // get user() {
  //   return this.authService.currentUser()
  // }
}
