import {debounce, runInContext} from "lodash";

export default function FastReloadingThrottle(maxCalls: number, timeFrame: number, context: any = null) {
    if (context) {
        runInContext(context);
    }

    return function FastReloadingThrottleDecorator(target: any, property: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = debounce(function (...args) {
            return originalMethod.apply(this, args);
        }, timeFrame / maxCalls);
    }
}

