import React, { useEffect, useState } from "react";
import { useRouteMatch, Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner, Button } from "react-bootstrap";
import Datatable from "react-data-table-component";
import Axios from "axios";
import moment from 'moment';
import UserDetails from "./UserDetails";
const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
        columns={columns}
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
        columns={columns}
  .add('Show Table Head', () => <ProgressPendingIndeterminateHeader />);
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Users = () => {
  let history = useHistory();
  let { path, url } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [userSpents, setUserSpents] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const getUsersSpents = async () => {
    const getUsersSpentsResponse = await Axios.get(
      "/db/users"
    );
    console.log(getUsersSpentsResponse.data);
    // setLoading(false);
    setUserSpents(getUsersSpentsResponse.data);
  };

  const columns = React.useMemo(
    () => [
      {
        name: "Ad",
        selector: "username",
        sortable: true,
      },
      {
        name: "Bakiye",
        selector: "balance",
        sortable: true,
      },
      {
        name: "Son Giriş",
        selector: "lastauth",
        sortable: true,
        cell: row => moment(row.lastauth).format('DD/MM/YYYY')
      },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getUsersSpents();
      setLoading(false);
    };
    getter();
  }, []);

  const loadingComponent = (
    <div
      className="d-flex align-items-center w-100 justify-content-center mt-auto"
      style={{ height: "100%" }}
    >
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <h3 className="ml-2">Loading</h3>
    </div>
  );

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
      <TextField id="search" type="text" placeholder="Filter By Name" aria-label="Search Input" value={filterText} onChange={onFilter} />
      <ClearButton type="button" onClick={onClear}>X</ClearButton>
    </>
  );
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const filteredItems = userSpents.filter(item => item.username && item.username.toLowerCase().includes(filterText.toLowerCase()));

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
  }, [filterText, resetPaginationToggle]);

  if (loading) {
    return loadingComponent;
  }
  return (
    <>

      <Switch>
        <Route exact path={path}>
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3 card">
                <div class="card-body">
                  <Datatable
                    title="En çok harcama yapan kullanıcılar"
                    columns={columns}
                    data={filteredItems}
                    pagination
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    onRowClicked={(event) => {
                      setSelectedUser(event);
                      history.push("/users/asd")
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Route>
        <Route path={`${path}/:userId`}>
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3 card">
                <div class="card-body">
                  <UserDetails selectedUser={selectedUser} />
                </div>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </>
  );
};

export default Users;
