import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Row {
  ts: string;
  node: string;
  url: string;
  cls: string;
  method: string;
  mb: number;
  objs: number;
}

interface Suspect {
  cls: string;
  method: string;
  url: string;
  calls: number;
  growth: number;
  maxMB: number;
  avgMB: number;
  objGrowth: number;
  sev: 'critical' | 'high' | 'medium' | 'normal';
}

@Component({
  selector: 'app-zope-analyser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zope-analyser.html',
  styleUrl: './zope-analyser.scss'
})
export class ZopeAnalyserComponent {
  readonly NOISE_URL = 'waitress.invalid';

  activeTab: 'verdict' | 'timeline' | 'suspects' | 'rawlog' = 'verdict';
  allRows: Row[] = [];
  suspectRows: Suspect[] = [];
  filteredSuspects: Suspect[] = [];
  filteredRaw: Row[] = [];
  fileNames: string[] = [];
  analysed = false;

  // KPIs
  totalGrowth = 0;
  leakRate = '0';
  objGrowth = 0;
  realRequests = 0;
  currentMB = 0;
  firstMB = 0;
  durationMins = 0;

  // Filters
  suspectFilter = '';
  rawFilter = '';

  // Sort
  suspectSortCol = 4;
  suspectSortAsc = false;

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) this.loadFiles(event.dataTransfer.files);
  }
  onDragOver(event: DragEvent) { event.preventDefault(); }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.loadFiles(input.files);
  }

  loadFiles(files: FileList) {
    const arr = Array.from(files);
    this.fileNames = arr.map(f => f.name);
    let loaded = 0;
    let combined: Row[] = [];
    arr.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const rows = this.parseCSV(e.target?.result as string);
        combined = combined.concat(rows);
        loaded++;
        if (loaded === arr.length) {
          if (!combined.length) { alert('No valid rows found.'); return; }
          combined.sort((a, b) => a.ts.localeCompare(b.ts));
          this.allRows = combined;
          this.analyse();
        }
      };
      reader.readAsText(file);
    });
  }

  parseCSV(text: string): Row[] {
    const lines = text.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const rows: Row[] = [];
    for (let i = 1; i < lines.length; i++) {
      const p = lines[i].split(',');
      if (p.length < 7) continue;
      rows.push({
        ts: p[0].trim(), node: p[1].trim(), url: p[2].trim(),
        cls: p[3].trim(), method: p[4].trim(),
        mb: parseFloat(p[5]) || 0, objs: parseInt(p[6]) || 0
      });
    }
    return rows;
  }

  severity(mb: number): 'critical' | 'high' | 'medium' | 'normal' {
    if (mb > 10) return 'critical';
    if (mb > 5)  return 'high';
    if (mb > 1)  return 'medium';
    return 'normal';
  }

  analyse() {
    const all = this.allRows;
    const real = all.filter(r => !r.url.includes(this.NOISE_URL));

    this.firstMB = all[0].mb;
    this.currentMB = all[all.length - 1].mb;
    this.totalGrowth = parseFloat((this.currentMB - this.firstMB).toFixed(2));
    this.objGrowth = all[all.length - 1].objs - all[0].objs;
    this.realRequests = real.length;

    const t1 = new Date(all[0].ts).getTime();
    const t2 = new Date(all[all.length - 1].ts).getTime();
    this.durationMins = Math.max(1, (t2 - t1) / 60000);
    this.leakRate = (this.totalGrowth / this.durationMins).toFixed(1);

    // Build suspects
    const ep: { [key: string]: { cls: string; method: string; url: string; rows: Row[] } } = {};
    real.forEach(r => {
      const key = `${r.cls}.${r.method}||${r.url}`;
      if (!ep[key]) ep[key] = { cls: r.cls, method: r.method, url: r.url, rows: [] };
      ep[key].rows.push(r);
    });

    this.suspectRows = Object.values(ep).map(e => {
      const mbs  = e.rows.map(r => r.mb);
      const objs = e.rows.map(r => r.objs);
      const grow = parseFloat((Math.max(...mbs) - Math.min(...mbs)).toFixed(2));
      const avgMB = parseFloat((mbs.reduce((a, b) => a + b, 0) / mbs.length).toFixed(2));
      return {
        cls: e.cls, method: e.method, url: e.url,
        calls: e.rows.length, growth: grow,
        maxMB: Math.max(...mbs), avgMB,
        objGrowth: Math.max(...objs) - Math.min(...objs),
        sev: this.severity(grow)
      };
    }).sort((a, b) => b.growth - a.growth);

    this.filteredSuspects = [...this.suspectRows];
    this.filteredRaw = [...this.allRows];
    this.analysed = true;
    this.activeTab = 'verdict';
  }

  get top3(): Suspect[] { return this.suspectRows.slice(0, 3); }
  get nodes(): string { return [...new Set(this.allRows.map(r => r.node))].join(', '); }
  get growthClass(): string {
    return this.totalGrowth > 50 ? 'red' : this.totalGrowth > 20 ? 'orange' : 'green';
  }
  get rateClass(): string {
    const r = parseFloat(this.leakRate);
    return r > 20 ? 'red' : r > 5 ? 'orange' : 'green';
  }
  get memClass(): string {
    return this.currentMB > 500 ? 'red' : this.currentMB > 300 ? 'orange' : 'green';
  }
  medal(i: number): string { return ['🥇','🥈','🥉'][i]; }
  shortUrl(url: string): string { return url.replace(/https?:\/\/[^/]+/, ''); }

  filterSuspects() {
    const q = this.suspectFilter.toLowerCase();
    this.filteredSuspects = this.suspectRows.filter(s =>
      (s.cls + s.method + s.url).toLowerCase().includes(q));
  }

  filterRaw() {
    const q = this.rawFilter.toLowerCase();
    this.filteredRaw = this.allRows.filter(r =>
      Object.values(r).join(' ').toLowerCase().includes(q));
  }

  sortSuspects(col: number) {
    if (this.suspectSortCol === col) this.suspectSortAsc = !this.suspectSortAsc;
    else { this.suspectSortCol = col; this.suspectSortAsc = false; }
    const keys: (keyof Suspect)[] = ['sev','cls','url','calls','growth','maxMB','avgMB','objGrowth'];
    this.filteredSuspects.sort((a, b) => {
      const va = a[keys[col]], vb = b[keys[col]];
      if (typeof va === 'string') return this.suspectSortAsc ? (va as string).localeCompare(vb as string) : (vb as string).localeCompare(va as string);
      return this.suspectSortAsc ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
  }

  growthColor(g: number): string {
    return g > 10 ? '#ff4d4d' : g > 5 ? '#ff9933' : g > 1 ? '#ffcc44' : '#44cc77';
  }

  rowSev(r: Row): string {
    if (r.url.includes(this.NOISE_URL)) return 'normal';
    return this.severity(r.mb > 0 ? r.mb - this.allRows[0].mb : 0);
  }

  reset() {
    this.allRows = [];
    this.suspectRows = [];
    this.filteredSuspects = [];
    this.filteredRaw = [];
    this.fileNames = [];
    this.analysed = false;
  }
}