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
  url = "/myapp/api",
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
      return { error: error.message || "Error fetching the list" };
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
      return { error: error.message || "Error fetching the resource" };
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
      return { error: error.message || "Error creating the resource" };
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
      return { error: error.message || "Error updating the resource" };
    }
  };

  const deleteOne = async (id) => {
    const headers = assertHeaders({
      Accept: "application/json",
    });
    const options = assertOptions({
      headers,
      method: "DELETE",
    });
    try {
      const response = await fetch(`${url}/${resource}/${id}`, options);
      const { data, error = "", message = "" } = await response.json();
      return { data, error, message };
    } catch (error) {
      return { error: error.message || "Error deleting the resource" };
    }
  };

  return { getList, getOne, createOne, updateOne, deleteOne };
};
