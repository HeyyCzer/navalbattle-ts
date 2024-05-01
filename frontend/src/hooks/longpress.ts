import { useMemo, useRef } from "react";

function isTouchEvent({ nativeEvent as any }) {
	return window.TouchEvent
	  ? nativeEvent instanceof TouchEvent
	  : "touches" in nativeEvent;
}

function isMouseEvent(event: any) {
	return event.nativeEvent instanceof MouseEvent;
}

export function useLongPress(callback: any, options: any = {}) {
	const { threshold = 400, onStart, onFinish, onCancel } = options;
	const isLongPressActive = useRef(false);
	const isPressed = useRef(false);
	const timerId = useRef();

	return useMemo(() => {
		if (typeof callback !== "function") {
			return {};
		}

		const start = (event: any) => {
			if (!isMouseEvent(event) && !isTouchEvent(event)) return;

			if (onStart) {
				onStart(event);
			}

			isPressed.current = true;
			timerId.current = setTimeout(() => {
				callback(event);
				isLongPressActive.current = true;
			}, threshold);
		};

		const cancel = (event: any) => {
			if (!isMouseEvent(event) && !isTouchEvent(event)) return;

			if (isLongPressActive.current) {
				if (onFinish) {
					onFinish(event);
				}
			} else if (isPressed.current) {
				if (onCancel) {
					onCancel(event);
				}
			}

			isLongPressActive.current = false;
			isPressed.current = false;

			if (timerId.current) {
				window.clearTimeout(timerId.current);
			}
		};

		const mouseHandlers = {
			onMouseDown: start,
			onMouseUp: cancel,
			onMouseLeave: cancel,
		};

		const touchHandlers = {
			onTouchStart: start,
			onTouchEnd: cancel,
		};

		return {
			...mouseHandlers,
			...touchHandlers,
		};
	}, [callback, threshold, onCancel, onFinish, onStart]);
}
