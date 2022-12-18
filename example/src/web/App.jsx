import { useEffect, useState } from "react";
import config from "virtual:vite-plugin-api:config";

function App() {
  const [list, setList] = useState([]);
  const [data, setData] = useState("");

  const onLoad = async () => {
    let list = await fetch("/api/dev").then((r) => r.json());
    setList(list);
  };

  const onTest = async (it) => {
    let data = await fetch(it.path, {
      method: it.method,
      headers: {
        "HTTP-Action": it.action,
      },
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
          <div className="badge bg-danger">Only Development Mode</div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <a href="#reload" onClick={onLoad}>
              Reload
            </a>
            <a href="/@id/virtual:vite-plugin-api:router" target="_blank">
              /@id/virtual:vite-plugin-api:router
            </a>
            <a href="/@id/virtual:vite-plugin-api:config" target="_blank">
              /@id/virtual:vite-plugin-api:config
            </a>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <table className="table table-striped">
                <tbody>
                  {list.map((it, ix) => (
                    <tr key={ix}>
                      <th className="text-uppercase">{it.method}</th>
                      <td>{it.path}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={(e) => onTest(it)}
                          disabled={it.method === "use"}
                        >
                          Test
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
