import { debounce, runInContext } from "lodash";

export default function debouncer(debouncerFrame: number, context: any = null) {
  if (context) {
    runInContext(context);
  }

  return function debouncerDecorator(
    target: any,
    property: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = debounce(function(...args) {
      return originalMethod.apply(this, args);
    }, debouncerFrame);
  };
}
