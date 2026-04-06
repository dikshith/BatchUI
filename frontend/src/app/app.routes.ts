import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { ScriptList } from './components/script-list/script-list';
import { ScriptAdd } from './components/script-add/script-add';
import { ScriptEdit } from './components/script-edit/script-edit';
import { ScriptLogs } from './components/script-logs/script-logs';
import { Runs } from './components/runs/runs';
import { CleanupComponent } from './components/cleanup/cleanup';
import { ConnectServerComponent } from './connect-server/connect-server';
import { UserInfoComponent } from './components/user-info/user-info';
import { PythonProfileModule } from './components/python-profile/python-profile.module';
import { PythonProfileComponent } from './components/python-profile/python-profile';
import { authGuard } from './guards/auth.guard';
import { ZopeAnalyserComponent } from './components/zope-analyser/zope-analyser';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'scripts',
    component: ScriptList,
    canActivate: [authGuard],
  },
  {
    path: 'scripts/add',
    component: ScriptAdd,
    canActivate: [authGuard],
  },
  {
    path: 'scripts/:id/edit',
    component: ScriptEdit,
    canActivate: [authGuard],
  },
  {
    path: 'scripts/:id/logs',
    component: ScriptLogs,
    canActivate: [authGuard],
  },
  {
    path: 'runs',
    component: Runs,
    canActivate: [authGuard],
  },
  {
    path: 'cleanup',
    component: CleanupComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'connect-server',
    component: ConnectServerComponent,
  },
  {
    path: 'logs',
    component: ScriptLogs,
    canActivate: [authGuard],
  },
  {
    path: 'python-profile',
    component: PythonProfileComponent,
    canActivate: [authGuard],
  },
  { path: 'zope-analyser',
    component: ZopeAnalyserComponent,
    canActivate: [authGuard],
  },
    {
    path: '**',
    redirectTo: '',
  },
];