import { Component, Input } from '@angular/core';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-box-example',
  templateUrl: './box_example.html',
  styleUrls: ['./box_example.scss']
})
export class BoxExampleComponent { 
  @Input() width!: string;
  @Input() height!: string;
}
