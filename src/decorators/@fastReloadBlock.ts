import {green, yellow} from "colors/safe";

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
                console.warn(yellow(`Please wait ${interval} secs. for next reload to prevent your extension being blocked`));
                const logInterval = setInterval(() => console.warn(yellow(`${--interval} ...`)), 1000);

                setTimeout(() => {
                    clearInterval(logInterval);
                    console.info(green("Signing for reload now"));
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


