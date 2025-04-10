import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export class Animations {
    public static fadeIn(): AnimationTriggerMetadata {
        return trigger('fadeIn', [
            transition(':enter', [style({ opacity: 0 }), animate('150ms ease-out', style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1 }), animate('150ms ease-in', style({ opacity: 0 }))])
        ]);
    }

    public static slideInRight(): AnimationTriggerMetadata {
        return trigger('slideIn', [
            transition(':enter', [style({ opacity: 0, transform: 'translateX(-1em)' }), animate('100ms ease-in', style({ opacity: 1, transform: 'translateX(0%)' }))]),
            transition(':leave', [style({ opacity: 1, transform: 'translateX(0%)' }), animate('150ms ease-in', style({ opacity: 0, transform: 'translateX(-1em)' }))])
        ]);
    }

    public static slideInUp(): AnimationTriggerMetadata {
        return trigger('slideInUp', [
            transition(':enter', [style({ opacity: 0, transform: 'translateY(1em)' }), animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0%)' }))]),
            transition(':leave', [style({ opacity: 1, transform: 'translateY(0%)' }), animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(1em)' }))])
        ]);
    }
}
