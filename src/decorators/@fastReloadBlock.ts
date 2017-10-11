import {info, warn} from "../utils/logger";

export default function FastReloadBlock(maxCalls: number, wait: number) {

    return function FastReloadingThrottleDecorator(target: any, property: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let calls = 0;
        let inWait = false;

        descriptor.value = function (...args) {
            if (inWait) {
                return;
            }
            else if (calls === maxCalls) {
                calls = 0;
                inWait = true;

                let interval = wait / 1000;
                warn(`Please wait ${interval} secs. for next reload to prevent your extension being blocked`);
                const logInterval = setInterval(() => warn(`${--interval} ...`), 1000);

                setTimeout(() => {
                    clearInterval(logInterval);
                    info("Signing for reload now");
                    originalMethod.apply(this, args);
                    inWait = false;
                }, wait);
            }
            else {
                calls++;
                return originalMethod.apply(this, args);
            }
        };
    }
}


