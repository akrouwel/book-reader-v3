import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SettingsModalComponent {
  constructor(@Inject('parent') public parent: any) {}
}