import Root from './file-input.svelte';

export type FormFileInputEvent<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLInputElement;
};
export type FileInputEvents = {
	blur: FormFileInputEvent<FocusEvent>;
	change: FormFileInputEvent<Event>;
	click: FormFileInputEvent<MouseEvent>;
	focus: FormFileInputEvent<FocusEvent>;
	focusin: FormFileInputEvent<FocusEvent>;
	focusout: FormFileInputEvent<FocusEvent>;
	keydown: FormFileInputEvent<KeyboardEvent>;
	keypress: FormFileInputEvent<KeyboardEvent>;
	keyup: FormFileInputEvent<KeyboardEvent>;
	mouseover: FormFileInputEvent<MouseEvent>;
	mouseenter: FormFileInputEvent<MouseEvent>;
	mouseleave: FormFileInputEvent<MouseEvent>;
	mousemove: FormFileInputEvent<MouseEvent>;
	paste: FormFileInputEvent<ClipboardEvent>;
	input: FormFileInputEvent<InputEvent>;
	wheel: FormFileInputEvent<WheelEvent>;
};

export {
	//
	Root as FileInput,
	Root,
};
