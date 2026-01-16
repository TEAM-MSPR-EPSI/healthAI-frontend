import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navigation/navbar/navbar';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faRocket, faHome, faInfoCircle, faUser, faBell, faEnvelope, faBars, faChartLine, faHeadset, faUsers, faDumbbell, faReceipt, faGear } from '@fortawesome/free-solid-svg-icons';
import { BoxExampleComponent } from "./components/box_example/box_example";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, BoxExampleComponent],
  templateUrl: './pages/app.html',
  styleUrls: ['../styles/app.css', '../styles/color.css']
})
export class App {
  protected readonly title = signal('frontend');

  constructor(library: FaIconLibrary) {
    library.addIcons(faRocket, faHome, faInfoCircle, faUser, faBell, faEnvelope, faBars, faChartLine, faHeadset, faUsers, faDumbbell, faReceipt, faGear);
  }
}
