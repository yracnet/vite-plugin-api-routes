import { useCallback, useEffect, useState } from "react";

const NOP = async () => {};
export const useAPICallback = (callback = NOP, { dataInit = {}, errorInit = "", messageInit = "" } = {}) => {
  const [data, setData] = useState(dataInit);
  const [error, setError] = useState(errorInit);
  const [message, setMessage] = useState(messageInit);

  const onReload = async (...args) => {
    const { data, error = "", message = "" } = await callback(...args);
    setData(data);
    setError(error);
    setMessage(message);
  };

  const setResult = ({ data, error = "", message = "" } = {}) => {
    setData(data);
    setError(error);
    setMessage(message);
  };

  return {
    onReload,
    data,
    setData,
    error,
    setError,
    message,
    setMessage,
    setResult,
  };
};

const eventMap = new Map();

export const useEventDispatch = (defaultEvent = "all") => {
  const dispatchEvent = useCallback((data) => {
    const listeners = eventMap.get(data.event || defaultEvent);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }, []);
  return dispatchEvent;
};

export const useEventListener = (callback, event = "all") => {
  useEffect(() => {
    if (!eventMap.has(event)) {
      eventMap.set(event, []);
    }
    const listeners = eventMap.get(event);
    listeners.push(callback);
    return () => {
      const updatedListeners = listeners.filter((listener) => listener !== callback);
      eventMap.set(event, updatedListeners);
    };
  }, [event, callback]);
};
