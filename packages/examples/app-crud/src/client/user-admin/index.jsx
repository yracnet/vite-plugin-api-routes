import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { userDP } from "../api";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState(null);
  const [shouldReload, setShouldReload] = useState(true);

  return (
    <UserContext.Provider
      value={{ selectedKey, setSelectedKey, shouldReload, setShouldReload }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

const UserTable = () => {
  const { shouldReload, setShouldReload, setSelectedKey } = useUserContext();
  const [searchQuery, setSearchQuery] = useState("");

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleEdit = async (userId) => {
    setSelectedKey(userId);
  };

  const handleDelete = async (userId) => {
    const { message, error } = await userDP.deleteOne(userId);
    setData([]);
    setError(error);
    setMessage(message);
    setSelectedKey(null);
    if (!error) {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    const { data, message, error } = await userDP.getList({ q: searchQuery });
    setData(data);
    setError(error);
    setMessage(message);
    setShouldReload(false);
  };

  useEffect(() => {
    if (shouldReload) {
      handleSearch();
    }
  }, [shouldReload]);

  return (
    <div className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </InputGroup>
      {shouldReload && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <ButtonGroup>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(user._id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="ml-2"
                    onClick={() => handleDelete(user._id)}
                  >
                    Eliminar
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const UserForm = () => {
  const { selectedKey, setSelectedKey, setShouldReload } = useUserContext();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error, message } = selectedKey
      ? await userDP.updateOne(user._id, user)
      : await userDP.createOne(user);
    setError(error);
    setMessage(message);
    setUser(data);
    setShouldReload(true);
  };

  const handleReset = async () => {
    const {
      data = {
        name: "",
        email: "",
      },
      message,
      error,
    } = selectedKey ? await userDP.getOne(selectedKey) : {};
    setError(error);
    setMessage(message);
    setUser(data);
  };

  const onChangeAttr = (name, value) => {
    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleNew = async () => {
    setError("");
    setMessage("");
    setUser({
      name: "",
      email: "",
    });
    setSelectedKey(null);
  };

  useEffect(() => {
    handleReset();
  }, [selectedKey]);

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Nombre"
        value={user.name}
        onChange={(e) => onChangeAttr("name", e.target.value)}
      />
      <Form.Control
        type="text"
        placeholder="Email"
        value={user.email}
        onChange={(e) => onChangeAttr("email", e.target.value)}
      />
      <ButtonGroup>
        <Button
          variant="primary"
          type="submit"
          className="mt-2"
          onClick={handleSubmit}
        >
          {user._id ? "Actualizar" : "Crear"}
        </Button>
        <Button variant="secondary" onClick={handleReset} className="mt-2 ml-2">
          Resetear
        </Button>
        <Button variant="warning" onClick={handleNew} className="mt-2 ml-2">
          New
        </Button>
      </ButtonGroup>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
    </div>
  );
};

export const UserAdmin = () => {
  return (
    <UserProvider>
      <Container>
        <h1>Gestión de Usuarios</h1>
        <Row>
          <Col>
            <UserTable />
          </Col>
          <Col>
            <UserForm />
          </Col>
        </Row>
      </Container>
    </UserProvider>
  );
};
