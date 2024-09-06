import Root from './password-input.svelte';

export type FormPasswordInputEvent<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLInputElement;
};
export type PasswordInputEvents = {
	blur: FormPasswordInputEvent<FocusEvent>;
	change: FormPasswordInputEvent<Event>;
	click: FormPasswordInputEvent<MouseEvent>;
	focus: FormPasswordInputEvent<FocusEvent>;
	focusin: FormPasswordInputEvent<FocusEvent>;
	focusout: FormPasswordInputEvent<FocusEvent>;
	keydown: FormPasswordInputEvent<KeyboardEvent>;
	keypress: FormPasswordInputEvent<KeyboardEvent>;
	keyup: FormPasswordInputEvent<KeyboardEvent>;
	mouseover: FormPasswordInputEvent<MouseEvent>;
	mouseenter: FormPasswordInputEvent<MouseEvent>;
	mouseleave: FormPasswordInputEvent<MouseEvent>;
	mousemove: FormPasswordInputEvent<MouseEvent>;
	paste: FormPasswordInputEvent<ClipboardEvent>;
	input: FormPasswordInputEvent<InputEvent>;
	wheel: FormPasswordInputEvent<WheelEvent>;
};

export {
	//
	Root as PasswordInput,
	Root,
};
