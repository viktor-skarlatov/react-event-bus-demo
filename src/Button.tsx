import { useCallback } from "react";
import { useEventBus } from "./context/useEventBus";
import { ButtonEvents, SomeOtherEvents } from "./events";

export function Button() {
    const { raiseEvent: raiseButtonEvent } = useEventBus<ButtonEvents>();
    const { raiseEvent: raiseOtherEvent } = useEventBus<SomeOtherEvents>();

    const onPress = useCallback(() => {
        raiseButtonEvent("button-press", new Date());
        raiseOtherEvent("custom-event", 0);
    }, [raiseButtonEvent, raiseOtherEvent]);

    const onHide = useCallback(() => {
        raiseButtonEvent("hide-button");
    }, [raiseButtonEvent]);

    return (
        <div>
            <button onClick={onPress}>PRESS ME</button>
            <button onClick={onHide}>HIDE</button>
        </div>
    );
}