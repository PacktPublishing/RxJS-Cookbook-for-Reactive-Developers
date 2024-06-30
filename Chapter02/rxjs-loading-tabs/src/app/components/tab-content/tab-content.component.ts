import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tab-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-content.component.html',
  styleUrl: './tab-content.component.scss'
})
export class TabContentComponent {
  // content = input<any>();
}
