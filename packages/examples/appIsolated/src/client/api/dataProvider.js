const NOP = (data) => data;

const getQuery = (params = {}) => {
  return Object.entries(params)
    .reduce((acc, [name, value]) => {
      acc.push(`${name}=${value}`);
      return acc;
    }, [])
    .join("&");
};

export const createDataProvider = ({
  //options
  url = "/api",
  resource = "",
  assertHeaders = NOP,
  assertOptions = NOP,
} = {}) => {
  const getList = async (params = {}) => {
    const query = getQuery(params);
    const headers = assertHeaders({
      Accept: "application/json",
    });
    const options = assertOptions({ headers });
    try {
      const response = await fetch(`${url}/${resource}?${query}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error al obtener la lista" };
    }
  };
  const getOne = async (id, params = {}) => {
    const query = getQuery(params);
    const headers = assertHeaders({
      Accept: "application/json",
    });
    const options = assertOptions({ headers });
    try {
      const response = await fetch(
        `${url}/${resource}/${id}?${query}`,
        options
      );
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error al obtener el recurso" };
    }
  };
  const createOne = async (data) => {
    const headers = assertHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const options = assertOptions({
      headers,
      method: "POST",
      body: JSON.stringify(data),
    });
    try {
      const response = await fetch(`${url}/${resource}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error al crear el recurso" };
    }
  };
  const updateOne = async (id, data) => {
    const headers = assertHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const options = assertOptions({
      headers,
      method: "PUT",
      body: JSON.stringify(data),
    });
    try {
      const response = await fetch(`${url}/${resource}/${id}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error al actualizar el recurso" };
    }
  };
  const patchOne = async (id, data) => {
    const headers = assertHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const options = assertOptions({
      headers,
      method: "PATCH",
      body: JSON.stringify(data),
    });
    try {
      const response = await fetch(`${url}/${resource}/${id}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return {
        error: error.message || "Error al actualizar parcialmente el recurso",
      };
    }
  };
  const deleteOne = async (id) => {
    const headers = assertHeaders({
      Accept: "application/json",
    });
    const options = assertOptions({ headers, method: "DELETE" });
    try {
      const response = await fetch(`${url}/${resource}/${id}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error al eliminar el recurso" };
    }
  };
  return {
    getList,
    getOne,
    createOne,
    updateOne,
    patchOne,
    deleteOne,
  };
};
