import { of, Subject } from 'rxjs';
import { editorOptions } from '../../../editor.options';
import { EditorViewComponent } from './editor-view.component';

describe('EditorViewComponent', () => {
    const createComponent = (): EditorViewComponent =>
        new EditorViewComponent({ settings: of({ isDarkModeEnabled: true, editorWordWrap: false }) } as any, { resize: new Subject<boolean>() } as any);

    it('starts with usable Monaco options before settings emit', () => {
        const component = createComponent();

        expect(component.options).toMatchObject({ ...editorOptions, readOnly: false, wordWrap: false, theme: 'vs-dark' });
    });

    it('ignores resize events before Monaco finishes mounting', () => {
        const component = createComponent();

        expect(() => component.triggerResize()).not.toThrow();
    });
});
