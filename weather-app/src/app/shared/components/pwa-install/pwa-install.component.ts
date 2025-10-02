import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `<button *ngIf="can" (click)="install()" class="pwa">
    ⬇ Install app
  </button>`,
  styles: [
    `
      .pwa {
        background: #2b2e48;
        border-radius: 12px;
        padding: 8px 12px;
      }
    `,
  ],
})
export class PwaInstallComponent {
  private promptEvent: any = null;
  can = false;

  constructor() {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.promptEvent = e;
      this.can = true;
    });
    window.addEventListener('appinstalled', () => {
      this.can = false;
      this.promptEvent = null;
    });
  }
  async install() {
    await this.promptEvent?.prompt();
    this.can = false;
  }
}
