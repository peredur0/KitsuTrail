import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    title = signal<string>('');
    subtitle = signal<string>('');

    setTitle(newTitle: string): void {
        this.title.set(newTitle);
    }

    setSubtitle(newSub: string): void {
        this.subtitle.set(newSub);
    }
}