import { ApiConfig } from "../model";
import { RouteEntry } from "./createRouteEntries";

type OrderKey = { order: string };

export const sortByOrder = (a: OrderKey, b: OrderKey) => a.order.localeCompare(b.order);


export const assertRoute = (value: string) => value
  .split("/")
  .map((item) => item
    // Param NextJS
    .replaceAll("[]", "*")
    .replaceAll("[...", "*")
    .replaceAll("[", ":")
    .replaceAll("]", "")
    // Param Remix
    .replaceAll("$$", "*")
    .replaceAll("$", ":"))
  .join("/");


export const assertOrder = ({ route, routePriority }: RouteEntry, { paramPriority, filePriority }: ApiConfig) => {
  const parts = route
    .split("/")
    .filter(Boolean);
  if (parts.length === 0) {
    return routePriority;
  }
  const priorities = parts.map((part) => {
    const s = "_" + part;
    if (/:|\[|\$/.test(part)) {
      return paramPriority + s;
    }
    return filePriority + s;
  });
  priorities.push(routePriority);
  return priorities.join("_");
};
