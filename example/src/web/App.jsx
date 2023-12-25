import { useEffect, useState } from "react";

const useJWTCookie = () => {
  const [jwtCookie, setJWTCookie] = useState([{}, []]);
  useEffect(() => {
    const cookieList = document.cookie.split(";").map((it) => {
      const [name, value] = it.split("=");
      return {
        name,
        value,
      };
    });
    let jwtData = {};
    try {
      const [, base64Url,] = cookieList.find(it => it.name === 'token')?.value?.split('.');
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      jwtData = JSON.parse(jsonPayload);
    } catch (error) {
      jwtData = error;
    }
    setJWTCookie([jwtData, cookieList]);
  }, [document.cookie]);
  return jwtCookie;
}

export const AppClient = () => {
  const [routers, setRouters] = useState([]);
  const [data, setData] = useState("");
  const [jwt, cookie] = useJWTCookie();

  const onLoad = async () => {
    let routers = await fetch(`${import.meta.env.BASE_URL}/api/routers`).then(
      (r) => r.json()
    );
    setRouters(routers);
  };

  const onTest = async (it) => {
    const id = parseInt(1000000 * Math.random());
    const url = it.url.replace(/(:\w+)/g, id);
    let data = await fetch(url, {
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
          VITE-PLUGIN-API-ROUTES
        </div>
        <div className="card-body">
          <table className="table table-sm">
            <tr>
              <th>name</th>
              <th>value</th>
            </tr>
            {cookie.map((it, ix) => (
              <tr key={it.name}>
                <td>{it.name}</td>
                <td>{it.value}</td>
              </tr>
            ))}
            <tr>
              <td>JWT</td>
              <td>
                <code>{JSON.stringify(jwt, null, 2)}</code>
              </td>
            </tr>
          </table>

          <div className="row">
            <div className="col-5">
              <a href="#reload" onClick={onLoad}>
                Reload
              </a>
              <table className="table table-striped">
                <tbody>
                  {routers
                    .filter((it) => it.method != "use")
                    .map((it) => (
                      <tr key={it.key}>
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
