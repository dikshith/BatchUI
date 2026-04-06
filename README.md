Files Created

frontend/src/app/components/zope-analyser/zope-analyser.ts — standalone Angular component with all CSV parsing, analysis, filtering, sorting logic
frontend/src/app/components/zope-analyser/zope-analyser.html — Angular template with dropzone, KPI cards, Summary/Suspects/Raw Log tabs
frontend/src/app/components/zope-analyser/zope-analyser.scss — styles matching the app's light theme

Files Modified

frontend/src/app/app.routes.ts — added import + route { path: 'zope-analyser', component: ZopeAnalyserComponent, canActivate: [authGuard] }
frontend/src/app/app.html — added nav <li> with routerLink="/zope-analyser" after Python Profile menuitem

Files Created (3 new files)
1. frontend/src/app/components/zope-analyser/zope-analyser.ts
2. frontend/src/app/components/zope-analyser/zope-analyser.html
3. frontend/src/app/components/zope-analyser/zope-analyser.scss

4. frontend/src/app/app.routes.ts — added 2 lines:

// Line added at top with other imports:
import { ZopeAnalyserComponent } from './components/zope-analyser/zope-analyser';

// Block added before the ** route:
{
  path: 'zope-analyser',
  component: ZopeAnalyserComponent,
  canActivate: [authGuard],
},

5. frontend/src/app/app.html — added 1 block after Python Profile </li>:

<li class="nav-item" routerLinkActive="active">
  <a routerLink="/zope-analyser" class="nav-link">
    <span class="nav-icon">🔍</span>
    <span class="nav-text">Zope Analyser</span>
  </a>
</li>


