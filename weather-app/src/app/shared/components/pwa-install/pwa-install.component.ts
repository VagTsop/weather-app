import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

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
export class PwaInstallComponent implements OnDestroy {
  private promptEvent: BeforeInstallPromptEvent | null = null;
  can = false;

  private readonly beforeInstallListener = (event: BeforeInstallPromptEvent) => {
    event.preventDefault();
    this.promptEvent = event;
    this.can = true;
  };

  private readonly appInstalledListener = () => {
    this.can = false;
    this.promptEvent = null;
  };

  constructor() {
    window.addEventListener(
      'beforeinstallprompt',
      this.beforeInstallListener as EventListener
    );
    window.addEventListener('appinstalled', this.appInstalledListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener(
      'beforeinstallprompt',
      this.beforeInstallListener as EventListener
    );
    window.removeEventListener('appinstalled', this.appInstalledListener);
  }

  async install() {
    await this.promptEvent?.prompt();
    this.can = false;
  }
}
