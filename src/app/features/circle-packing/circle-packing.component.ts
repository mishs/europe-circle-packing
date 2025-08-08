import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { CountryDrawerComponent } from '../country-drawer-component/country-drawer.component';
import { Country } from '../../models/country.model';

type ValueProp = 'population' | 'land_area_km2';

@Component({
  selector: 'app-circle-packing',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatSidenavModule, MatIconModule, CountryDrawerComponent],
  // providers: [provideHttpClient()],
  templateUrl: './circle-packing.component.html',
  styleUrls: ['./circle-packing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirclePackingComponent implements AfterViewInit {
  @ViewChild('svgContainer', { static: true }) svgRef!: ElementRef<SVGSVGElement>;
  http = inject(HttpClient);
  // simple local state for standalone sample
  valueProperty: ValueProp = 'population';
  selectedCountry: Country | null = null;

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private g!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  private width = 1000;
  private height = 720;

  private color = d3.scaleOrdinal<string>()
    .range(d3.schemeSet2 as readonly string[]); // region colors

  private data: any; // parsed Europe data
  private root!: d3.HierarchyNode<any>;

  ngAfterViewInit() {
    this.svg = d3.select(this.svgRef.nativeElement)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Circle packing of European countries grouped by region');

    this.g = this.svg.append('g');

    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    console.log('[viz] mounted, fetching data…'); // sanity 1

    this.http.get<any>('assets/europe_population_enriched.json').pipe(take(1)).subscribe({
      next: json => {
        console.log('[viz] data loaded'); // sanity 2
        this.data = this.normalize(json);
        this.render(this.valueProperty, true);
      },
      error: err => {
        console.error('[viz] data load failed', err);
        // Minimal fallback to still see circles and know the viz renders.
        const fallback = { Europe: { 'Northern Europe': [
          { country: 'Fallbackland', population: 123456, land_area_km2: 9876, wikipedia: '#', flag: '', region: 'Northern Europe' }
        ]}};
        this.data = this.normalize(fallback);
        this.render(this.valueProperty, true);
      }
    });
  }

  onToggle(prop: ValueProp) {
    if (prop === this.valueProperty) return;
    this.valueProperty = prop;
    this.render(prop, false); // transition update
  }

  onDrawerClosed() {
    this.selectedCountry = null;
  }

  private normalize(json: any) {
    const regions = Object.entries(json.Europe).map(([region, countries]: any) => ({
      name: region,
      children: countries.map((c: any) => ({ ...c, region }))
    }));
    return { name: 'Europe', children: regions };
  }

  private computeHierarchy(prop: ValueProp) {
    this.root = d3.hierarchy(this.data)
      .sum((d: any) => (d[prop] || 0))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    return d3.pack<any>().size([this.width, this.height]).padding(12)(this.root);
  }

  private render(prop: ValueProp, first: boolean) {
    console.log('[viz] render', prop, { first });
    const packed = this.computeHierarchy(prop);
    const nodes = packed.descendants();

    // --- REGION OUTLINES (depth 1) ---
    const regionNodes = nodes.filter(d => d.depth === 1);
    const regionsSel = this.g.selectAll<SVGCircleElement, d3.HierarchyNode<any>>('.region')
      .data(regionNodes, (d: any) => d.data.name);

    regionsSel.enter()
      .append('circle')
      .attr('class', 'region')
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', d => d.r)
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-width', 2)
      .attr('pointer-events', 'none');

    regionsSel.transition().duration(first ? 0 : 600)
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', d => d.r);

    // --- REGION LABELS ---
    const regionLabels = this.g.selectAll<SVGTextElement, any>('.region-label')
      .data(regionNodes, (d: any) => d.data.name);

    regionLabels.enter()
      .append('text')
      .attr('class', 'region-label')
      .attr('x', d => d.x).attr('y', d => d.y - (d.r + 6))
      .attr('text-anchor', 'middle')
      .attr('fill', '#475569')
      .attr('font-size', '14px')
      .text(d => d.data.name);

    regionLabels.transition().duration(first ? 0 : 600)
      .attr('x', d => d.x).attr('y', d => d.y - (d.r + 6));

    // --- COUNTRIES (depth 2) ---
    const countryNodes = nodes.filter(d => d.depth === 2);
    const countries = this.g.selectAll<SVGCircleElement, any>('.country')
      .data(countryNodes, (d: any) => d.data.country);

    const enter = countries.enter()
      .append('circle')
      .attr('class', 'country')
      .attr('tabindex', 0)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 0)
      .attr('fill', d => this.color(d.parent?.data.name))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (_, d) => this.selectedCountry = d.data)
      .on('keydown', (event: KeyboardEvent, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.selectedCountry = d.data;
        }
      })
      .on('mouseenter', (event, d) => {
        this.tooltip
          .style('opacity', 1)
          .html(`<b>${d.data.country}</b><br>${this.labelValue(prop, d.data[prop])}`)
          .style('left', `${event.pageX + 12}px`)
          .style('top', `${event.pageY + 12}px`);
        d3.select(event.currentTarget as Element).attr('stroke', '#0f172a');
      })
      .on('mousemove', (event) => {
        this.tooltip.style('left', `${event.pageX + 12}px`).style('top', `${event.pageY + 12}px`);
      })
      .on('mouseleave', (event) => {
        this.tooltip.style('opacity', 0);
        d3.select(event.currentTarget as Element).attr('stroke', '#fff');
      });

    // grow in
    enter.transition().duration(first ? 300 : 600).attr('r', d => d.r);

    // update positions/radii on toggle
    countries.transition().duration(first ? 0 : 600)
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', d => d.r)
      .attr('fill', d => this.color(d.parent?.data.name));

    countries.exit().transition().duration(300).attr('r', 0).remove();

    // --- COUNTRY LABELS (only if big enough) ---
    const labels = this.g.selectAll<SVGTextElement, any>('.country-label')
      .data(countryNodes.filter(d => d.r > 22), (d: any) => d.data.country);

    labels.enter()
      .append('text')
      .attr('class', 'country-label')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('fill', '#ffffff')
      .attr('font-size', '12px')
      .attr('x', d => d.x).attr('y', d => d.y + 4)
      .text(d => d.data.country);

    labels.transition().duration(first ? 0 : 600)
      .attr('x', d => d.x).attr('y', d => d.y + 4);

    labels.exit().remove();
  }

  private labelValue(prop: ValueProp, v: number) {
    return prop === 'population'
      ? `${d3.format(',')(v)} people`
      : `${d3.format(',')(v)} km²`;
  }
}
