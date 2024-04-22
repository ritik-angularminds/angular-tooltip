import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TooltipDirective } from './tooltip/tooltip.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TooltipDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tooltip';
}
