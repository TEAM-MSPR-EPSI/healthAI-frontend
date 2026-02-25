import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Pipe pour sécuriser les URLs Grafana dans les iframes.
 * Utilisation : [src]="url | grafanaUrl"
 */
@Pipe({
  name: 'grafanaUrl',
  standalone: true,
})
export class GrafanaUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
