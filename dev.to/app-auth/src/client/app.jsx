import { CoreAdminContext, Resource } from "ra-core";
import apiServerProvider from "ra-data-simple-rest";
import { UserCreate, UserEdit, UserList, UserShow } from "./user";

const dataProvider = apiServerProvider("/api/admin");

const App = () => {
  return (
    <CoreAdminContext dataProvider={dataProvider}>
      <Resource
        name="profile"
        list={UserList}
        create={UserCreate}
        edit={UserEdit}
        show={UserShow}
      />
    </CoreAdminContext>
  );
};

export default App;
