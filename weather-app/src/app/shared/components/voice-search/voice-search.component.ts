import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voice-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="mic" (click)="toggle()" [disabled]="!supported()">
      🎤 <span *ngIf="listening()">Listening…</span
      ><span *ngIf="!listening()">Voice</span>
    </button>
  `,
  styles: [
    `
      .mic {
        background: #2b2e48;
        border-radius: 12px;
        padding: 8px 12px;
      }
      .mic[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class VoiceSearchComponent {
  @Output() text = new EventEmitter<string>();
  listening = signal(false);
  private rec: any;

  supported() {
    return (
      typeof (window as any).webkitSpeechRecognition !== 'undefined' ||
      typeof (window as any).SpeechRecognition !== 'undefined'
    );
  }

  toggle() {
    if (!this.supported()) return;
    if (this.listening()) {
      this.rec?.stop();
      return;
    }

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    this.rec = new SR();
    this.rec.lang = 'en-US';
    this.rec.interimResults = false;
    this.rec.maxAlternatives = 1;
    this.rec.onresult = (e: any) => {
      const phrase = e.results?.[0]?.[0]?.transcript?.trim();
      if (phrase) this.text.emit(phrase);
    };
    this.rec.onend = () => this.listening.set(false);
    this.rec.onerror = () => this.listening.set(false);
    this.listening.set(true);
    this.rec.start();
  }
}
