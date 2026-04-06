Files Created

frontend/src/app/components/zope-analyser/zope-analyser.ts — standalone Angular component with all CSV parsing, analysis, filtering, sorting logic
frontend/src/app/components/zope-analyser/zope-analyser.html — Angular template with dropzone, KPI cards, Summary/Suspects/Raw Log tabs
frontend/src/app/components/zope-analyser/zope-analyser.scss — styles matching the app's light theme

Files Modified

frontend/src/app/app.routes.ts — added import + route { path: 'zope-analyser', component: ZopeAnalyserComponent, canActivate: [authGuard] }
frontend/src/app/app.html — added nav <li> with routerLink="/zope-analyser" after Python Profile menuitem
