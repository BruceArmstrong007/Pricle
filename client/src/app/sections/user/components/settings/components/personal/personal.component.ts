import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { PricleUiComponent } from './components/pricle-ui/pricle-ui.component';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [AccordionModule, PricleUiComponent],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent {

}
