import {
  ListBase,
  RecordContextProvider,
  useFieldValue,
  useListContext,
  useRecordContext,
} from "ra-core";

const Column = (props) => {
  const value = useFieldValue(props);
  return <div>xxx{JSON.stringify(value)}</div>;
};

const Row = () => {
  const record = useRecordContext();
  return <div>{JSON.stringify(record)}</div>;
};

const Grid = (props) => {
  const { data, isPending } = useListContext();
  return (
    <>
      {isPending ? (
        <b>Cargando...</b>
      ) : (
        data.map((it) => (
          <RecordContextProvider value={it}>
            {props.children}
          </RecordContextProvider>
        ))
      )}
    </>
  );
};

export const UserList = () => {
  return (
    <ListBase>
      <b>UserList</b>
      <Grid>
        <Column source="id" />
        <Column source="name" />
        <Row />
      </Grid>
    </ListBase>
  );
};
export const UserCreate = () => {
  return <b>UserCreate</b>;
};
export const UserEdit = () => {
  return <b>UserEdit</b>;
};
export const UserShow = () => {
  return <b>UserShow</b>;
};
