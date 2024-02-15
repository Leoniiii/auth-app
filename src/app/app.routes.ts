import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/loginPage/loginPage.component';
import { RegisterPageComponent } from './auth/pages/registerPage/registerPage.component';
import { DashboardLayoutComponent } from './dashboard/layouts/dashboard-layout/dashboard-layout.component';
import { AuthLayoutComponent } from './auth/layouts/authLayout/authLayout.component';
import { isAuthenticatedGuard } from './guards/isAuthenticated.guard';

export const routes: Routes = [
    {
        path: 'auth', component: AuthLayoutComponent,
        children: [

            { path: 'login', component: LoginPageComponent },
            { path: 'register', component: RegisterPageComponent },
            { path: '**', redirectTo: 'login' },

        ]
    },
    {
        path: 'dashboard', component: DashboardLayoutComponent, canActivate: [isAuthenticatedGuard]
    },
    {
        path: '**', redirectTo: 'auth'
    }
];
