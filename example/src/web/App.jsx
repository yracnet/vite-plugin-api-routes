import { useEffect, useState } from "react";

export const AppClient = () => {
  const [routers, setRouters] = useState([]);
  const [data, setData] = useState("");

  const onLoad = async () => {
    let routers = await fetch(`${import.meta.env.BASE_URL}/api/routers`).then(
      (r) => r.json()
    );
    setRouters(routers);
  };

  const onTest = async (it) => {
    let data = await fetch(it.url, {
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
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-5">
              <a href="#reload" onClick={onLoad}>
                Reload
              </a>
              <table className="table table-striped">
                <tbody>
                  {routers
                    .filter((it) => it.method != "use")
                    .map((it, ix) => (
                      <tr key={ix}>
                        <th className="text-uppercase">{it.method}</th>
                        <td>{it.url}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => onTest(it)}
                          >
                            Test
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="col-7">
              <b>Response</b>
              <pre>
                <code>{data}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
