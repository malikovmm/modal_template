import { useEffect, useState } from "react";

function getStorageItem<T>(key: string, defaultValue: T): T {
  const saved = localStorage.getItem(key);
  const parsed: T | null = JSON.parse(saved as string);
  return parsed ?? defaultValue;
}

const eventTypeName = "customStorageEvent";

type EventDetail<T> = Record<"newValue", T>;

const useLocalStorageValue = <T>(
  key: string,
  defaultValue: T
): [T, (nextValue: T) => void] => {
  const [value, setValue] = useState<T>(() =>
    getStorageItem(key, defaultValue)
  );
  const setIt = (nextValue: T) => {
    localStorage.setItem(key, JSON.stringify(nextValue));
    setValue(nextValue);
    const ev = new CustomEvent(eventTypeName, {
      detail: { newValue: nextValue }
    });
    window.dispatchEvent(ev);
  };

  useEffect(() => {
    const handler = (e: CustomEvent<EventDetail<T>>) => {
      setValue(e.detail.newValue);
    };
    window.addEventListener(eventTypeName, handler as EventListener);
    localStorage.setItem(key, JSON.stringify(value as any));
    return () =>
      window.removeEventListener(eventTypeName, handler as EventListener);
  }, [value, key]);

  return [value, setIt];
};
export default useLocalStorageValue;
