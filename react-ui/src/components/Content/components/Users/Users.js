import React, { useEffect, useState, useRef } from "react";
import { useRouteMatch, Route, Switch, useHistory } from "react-router-dom";
import Datatable from "react-data-table-component";
import { TagPicker } from "rsuite";
import API from "../../../../api";
import moment from "moment";
import UserDetails from "./UserDetails";
import LoadingIndicator from "../../../UI/LoadingIndicator";

const Users = () => {
  console.log("Rendering => Users");
  let history = useHistory();
  let { path, url } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [tagValue, setTagValue] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const getUsers = async () => {
    let query = "/db/users";
    console.log(tagValue);
    if(tagValue.length > 0)
      query = "/db/users?" + tagValue.map(user => `username=${user}&`).join('')
    const getUsersResponse = await API.get(query);
    if(!users.length)
      setUsers(getUsersResponse);
    if(tagValue.length > 0)
      setFilteredUsers(getUsersResponse);
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
      console.log(filteredUsers);
      setLoading(false);
    };
    getter();
  }, [selectedUser, tagValue]);

  const onChangeHandler = event => {
    console.log(event);
    setTagValue(event);
  }

  const Filters = () => (
    <div className="d-flex justify-content-end mb-3">
      <TagPicker data={ users.length && users.map(user => {
        return {
          label: user.username,
          value: user.username
        }
      })} style={{ width: 300 }} onChange={e=>onChangeHandler(e)} value={tagValue} placeholder='Kullanıcı seç'/>
    </div>
  );

  if (loading) {
    return <LoadingIndicator />;
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
                  <Filters />
                  <Datatable
                    title="Kullanıcılar"
                    columns={columns}
                    data={tagValue.length > 0 ? filteredUsers : users}
                    pagination
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
