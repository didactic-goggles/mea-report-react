import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Datatable from 'react-data-table-component';
import { TagPicker } from 'rsuite';
import API from '../../../../api';
import moment from 'moment';
import LoadingIndicator from '../../../UI/LoadingIndicator';

const Users = () => {
  console.log('Rendering => Users');
  let history = useHistory();
  // let { path } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [tagValue, setTagValue] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  // const [selectedUser, setSelectedUser] = useState('');

  const columns = [
      {
        name: 'Ad',
        selector: 'u',
        sortable: true,
      },
      {
        name: 'Bakiye',
        selector: 'b',
        sortable: true,
      },
      {
        name: 'Son Giriş',
        selector: 'l',
        sortable: true,
        cell: (row) => moment(row.l * 1000).format('DD/MM/YYYY'),
      },
    ];

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      let query = '/db/users';
      console.log(tagValue);
      if (tagValue.length > 0)
        query = '/db/users?' + tagValue.map((user) => `u=${user}&`).join('');
      const getUsersResponse = await API.get(query);
      if (!users.length) setUsers(getUsersResponse);
      if (tagValue.length > 0) setFilteredUsers(getUsersResponse);
      setLoading(false);
    };
    getUsers();
  }, [tagValue, users.length]);

  const onChangeHandler = (event) => {
    console.log(event);
    setTagValue(event);
  };

  const Filters = () => (
    <div className="d-flex justify-content-end mb-3">
      <TagPicker
        data={
          users.length
            ? users.map((user) => {
                return {
                  label: user.u,
                  value: user.u,
                };
              })
            : []
        }
        style={{ width: 300 }}
        onChange={(e) => onChangeHandler(e)}
        value={tagValue}
        placeholder="Kullanıcı seç"
      />
    </div>
  );

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card">
            <div className="card-body">
              {/* <SubHeaderComponent /> */}
              <Filters />
              <Datatable
                title="Kullanıcılar"
                columns={columns}
                data={tagValue.length > 0 ? filteredUsers : users}
                pagination
                responsive={true}
                striped={true}
                highlightOnHover={true}
                pointerOnHover={true}
                onRowClicked={(event) => {
                  history.push(`user/${event.id}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
