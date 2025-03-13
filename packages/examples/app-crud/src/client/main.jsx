import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { UserAdmin } from "./user-admin";

const Timer = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toISOString());
    };
    const id = setInterval(update, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);
  return <h4>{time}</h4>;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Timer />
    <UserAdmin />
  </StrictMode>
);
