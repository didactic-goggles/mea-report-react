import React, { useEffect, useState, useRef } from "react";
import { useRouteMatch, Route, Switch, useHistory } from "react-router-dom";

import { Spinner } from "react-bootstrap";
import Datatable from "react-data-table-component";
import { Input, InputGroup, Icon } from "rsuite";
import Axios from "axios";
import moment from "moment";
import UserDetails from "./UserDetails";

const Users = () => {
  console.log("Rendering => Users");
  let history = useHistory();
  let { path, url } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState("");
  const getUsers = async () => {
    const getUsersResponse = await Axios.get("/db/users");
    console.log(getUsersResponse.data);
    // setLoading(false);
    setUsers(getUsersResponse.data);
    setFilteredUsers(getUsersResponse.data);
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
        cell: (row) => moment(row.lastauth).format("DD/MM/YYYY"),
      },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getUsers();
      setLoading(false);
    };
    getter();
  }, []);

  const onInputChange = (searchVal) => {
    // const enteredUsers = searchVal.replace(' ', '').split(',');
    // const filteredUserArray = users.filter(user => enteredUsers.indexOf(user.username) !== -1);
    // setFilteredUsers(filteredUserArray);
    console.log(searchVal);
    // setEnteredUsers(searchVal);
    // console.log(searchVal);
  };

  const searchHandler = () => {
    console.log(searchValue);
    // const enteredUsers = searchVal.replace(' ', '').split(',');
    // const filteredUserArray = users.filter(user => enteredUsers.indexOf(user.username) !== -1);
    // setFilteredUsers(filteredUserArray);
    // console.log(searchVal);
  };

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

  const SubHeaderComponent = React.memo(() => {
    return (
      <form>
        <InputGroup inside>
          <Input
            onChange={(event) => setSearchValue(event)}
            key="input_search"
          />
          <InputGroup.Button onClick={searchHandler}>
            <Icon icon="search" />
          </InputGroup.Button>
        </InputGroup>
      </form>
    );
  });

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
                  {/* <SubHeaderComponent /> */}
                  <Datatable
                    title="Kullanıcılar"
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    subHeader
                    subHeaderComponent={<SubHeaderComponent />}
                    onRowClicked={(event) => {
                      setSelectedUser(event);
                      history.push(`users/${event.id}`);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Route>
        <Route path={`${path}/:id`}>
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
