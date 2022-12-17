import { useEffect, useState } from "react";
import config from "virtual:vite-plugin-api:config";

function App() {
  const [list, setList] = useState([]);
  const [data, setData] = useState("");

  const onLoad = async () => {
    let list = await fetch("/@vite-plugin-api/routers").then((r) => r.json());
    setList(list);
  };

  const onTest = async (it) => {
    let data = await fetch(it.route, {
      method: it.method,
    })
      .then((r) => r.json())
      .catch((error) => ({ error, message: error.message }));
    setData(JSON.stringify(data, null, 2));
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between">
          VITE-PLUGIN-API
          <div className="badge bg-danger"> Only Development Mode</div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <a href="#reload" onClick={onLoad}>
              Reload
            </a>
            <a href="/@id/virtual:api-router:router" target="_blank">
              /@id/virtual:api-router:router
            </a>
            <a href="/@id/virtual:api-router:server" target="_blank">
              /@id/virtual:api-router:server
            </a>
            <a href="/@id/virtual:api-router:handler" target="_blank">
              /@id/virtual:api-router:handler
            </a>
            <a href="/@vite-plugin-api/routers" target="_blank">
              /@vite-plugin-api/routers
            </a>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <ul className="list-group">
                {list.map((it, ix) => (
                  <li
                    key={ix}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <code className="ms-2 me-auto">
                      {it.method?.toUpperCase()} {it.route}
                    </code>
                    <a href="#reload" onClick={(e) => onTest(it)}>
                      Test
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-4">
              <b>Response</b>
              <pre>
                <code>{data}</code>
              </pre>
            </div>
            <div className="col-4">
              <b>Config</b>
              <pre>
                <code>{JSON.stringify(config, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
