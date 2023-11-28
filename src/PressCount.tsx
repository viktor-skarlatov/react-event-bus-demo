import { useCallback, useMemo, useState } from "react";
import { useEventBus } from "./context/useEventBus";
import { ButtonEvents } from "./events";

export function PressCount() {
    const [state, setState] = useState({
        count: 0,
        timeOfPress: new Date(),
    });

    const onButtonPress = useCallback((timeOfPress: Date) => {
        setState(s => ({
            count: s.count + 1,
            timeOfPress,
        }));
    }, []);

    const subscriptions: ButtonEvents = useMemo(() => ({
        "button-press": onButtonPress,
    }), [onButtonPress]);

    useEventBus(subscriptions);

    return (
        <div>
            <div>Count {state.count}</div>
            <div>{state.timeOfPress.toTimeString()}</div>
        </div>
    );
}