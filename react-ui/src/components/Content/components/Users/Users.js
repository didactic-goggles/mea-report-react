/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-extend-native */
import React, { useEffect, useState, forwardRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Datatable from 'react-data-table-component';
import {
  Button,
  SelectPicker,
  Alert,
  TagPicker,
  Whisper,
  // Tooltip,
  Popover,
  Loader,
} from 'rsuite';
import DateRangePicker from '../../../UI/DateRangePicker';
import moment from 'moment';
import API from '../../../../api';
import LoadingIndicator from '../../../UI/LoadingIndicator';

const Users = () => {
  console.log('Rendering => Users');
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [datatableDefaultSortField, setDatatableDefaultSortField] =
    useState('n');
  const [users, setUsers] = useState([]);
  const [tagValue, setTagValue] = useState([]);
  const [tagValues, setTagValues] = useState([]);
  const [sourceSite, setSourceSite] = useState('');
  // const [provider, setProvider] = useState('');
  const [userCalculation, setUserCalculation] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, 'days').unix(),
    endDate: moment().unix(),
  });
  const [visibleColumns, setVisibleColumns] = useState([
    {
      name: 'Name',
      selector: 'id',
      sortable: true,
      cell: (row) => {
        return <div>{row.id.split('-')[1]}</div>;
      },
    },
  ]);

  const setReportItem = async () => {
    // check if there is an item and delete
    const activeReportItem = await API.get('/db/reports?t=User');
    if (activeReportItem[0])
      await API.delete(`/db/reports/${activeReportItem[0].id}`);
    const newReportItem = await API.post('/db/reports', {
      t: 'User',
      c: moment().unix(),
      src: sourceSite,
      sd: selectedDate.startDate,
      ed: selectedDate.endDate,
    });
    setUserCalculation(newReportItem);
  };

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      let url = '/db/users?';
      if (sourceSite && sourceSite !== '') {
        url += `src=${sourceSite}&`;
      } else {
        setUserCalculation(null);
        setTagValues([]);
        // back to old columns
        setVisibleColumns(visibleColumns.slice(0, 1));
      }
      if (tagValue.length !== 0) {
        url += tagValue.map((user) => `u=${user}&`).join('');
      }
      const getUsersResponse = await API.get(url);
      setUsers(getUsersResponse);
      const activeReportItem = await API.get(
        `/db/reports?t=User&src=${sourceSite}`
      );
      if (activeReportItem) setUserCalculation(activeReportItem[0]);
      setLoading(false);
    };
    getUsers();
  }, [sourceSite, tagValue]);

  useEffect(() => {
    const tempFilteredUsers = [];
    if (users && users.length > 0) {
      users.forEach(
        (u) => !tempFilteredUsers.includes(u.u) && tempFilteredUsers.push(u.u)
      );
    }
    console.log(tempFilteredUsers);
    setTagValues(tempFilteredUsers);
  }, [users]);

  // const DefaultPopover = forwardRef(({ content, ...props }, ref) => {
  //   return (
  //     <Popover ref={ref} title="Title" {...props}>
  //       <p>This is a Popover </p>
  //       <p>{content}</p>
  //     </Popover>
  //   );
  // });

  const PopoverWithLoader = forwardRef((props, ref) => {
    const { serviceId } = props;
    const [serviceLoading, setServiceLoading] = useState(true);
    const [serviceDetails, setServiceDetails] = useState(null);

    useEffect(() => {
      const getServiceDetails = async () => {
        const getServiceDetails = await API.get(`/db/services/${serviceId}`);
        setServiceLoading(false);
        setServiceDetails(getServiceDetails);
      };
      getServiceDetails();
    }, [serviceId]);

    return (
      <Popover ref={ref} {...props}>
        {serviceLoading ? (
          <Loader content="Servis yükleniyor..." />
        ) : (
          <div>{serviceDetails && serviceDetails.n}</div>
        )}
      </Popover>
    );
  });

  const CustomComponent = ({ placement, loading, children, serviceId }) => (
    <Whisper
      trigger="hover"
      placement={placement}
      controlId={`control-id-${placement}`}
      speaker={<PopoverWithLoader serviceId={serviceId} />}
    >
      <Link to={`/service/${serviceId}`}>{serviceId}</Link>
    </Whisper>
  );
  useEffect(() => {
    if (userCalculation && visibleColumns.length === 1) {
      setVisibleColumns((activeColumns) => [
        ...activeColumns,
        {
          name: 'En Çok Kul. Servis',
          selector: 's',
          sortable: true,
          maxWidth: '200px',
          cell: (row) => {
            return (
              <CustomComponent
                placement="top"
                loading={loading}
                serviceId={row.s}
              />
              //
            );
          },
        },
        {
          name: 'Toplam Sipariş',
          selector: 'q',
          sortable: true,
          maxWidth: '100px',
        },
        {
          name: 'Toplam Tutar',
          selector: 'e',
          sortable: true,
          maxWidth: '100px',
        },
        {
          name: 'Toplam Kazanç',
          selector: 'c',
          sortable: true,
          maxWidth: '100px',
        },
      ]);
      setDatatableDefaultSortField('q');
    }
  }, [userCalculation, visibleColumns.length]);

  const calculateUserStats = async () => {
    setButtonLoading(true);
    try {
      if (!sourceSite || sourceSite === '') {
        throw new Error('Lütfen kaynak seç');
      }
      if (!selectedDate.startDate || !selectedDate.endDate) {
        throw new Error('Geçersiz tarih');
      }
      const allOrders = await API.get(
        `/db/orders?d_gte=${selectedDate.startDate}&d_lte=${selectedDate.endDate}`
      );
      if (!allOrders || allOrders.length === 0) {
        throw new Error('Sipariş bulunamadı');
      }
      if (allOrders.length > 0) {
        const calculatedUsers = {};
        allOrders.forEach((o) => {
          const userIndex = o.u;
          if (calculatedUsers[userIndex]) {
            calculatedUsers[userIndex].q += 1;
            calculatedUsers[userIndex].e += o.e;
            calculatedUsers[userIndex].c += o.c;
            if (calculatedUsers[userIndex].services[o.s])
              calculatedUsers[userIndex].services[o.s] += 1;
            else calculatedUsers[userIndex].services[o.s] = 1;
          } else {
            calculatedUsers[userIndex] = {};
            calculatedUsers[userIndex].q = 1;
            calculatedUsers[userIndex].e = o.e;
            calculatedUsers[userIndex].c = o.c;
            calculatedUsers[userIndex].services = {};
            calculatedUsers[userIndex].services[o.s] = 1;
          }
        });
        const promisesArray = [];
        const updateUser = async (userId, userData) => {
          userData.s = Object.keys(userData.services).sort((k1, k2) =>
            userData.services[k1] < userData.services[k2] ? 1 : -1
          )[0];
          userData.e = userData.e.round(3);
          userData.c = userData.c.round(3);
          delete userData.services;
          const updateUserResponse = await API.patch(
            `/db/users/${userId}`,
            userData
          );
          console.log(updateUserResponse);
        };
        Object.keys(calculatedUsers).forEach((userId) => {
          promisesArray.push(updateUser(userId, calculatedUsers[userId]));
        });
        await Promise.all(promisesArray);
        const getUsersResponse = await API.get(`/db/users`);
        await setReportItem();
        setUsers(getUsersResponse);
      }
    } catch (error) {
      Alert.error(error.message, 3000);
    }
    setButtonLoading(false);
  };

  const onChangeHandler = (event) => {
    console.log(event);
    setTagValue(event);
  };

  if (loading) return <LoadingIndicator />;

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card card-body">
            <div className="row">
              <div className="col-6 d-flex flex-column">
                <SelectPicker
                  data={[
                    { label: 'Measmm', value: '1' },
                    { label: 'Sosyalbayiniz', value: '2' },
                  ]}
                  style={{ width: 300 }}
                  value={sourceSite}
                  onChange={(sourceSiteValue) => setSourceSite(sourceSiteValue)}
                  placeholder="Kaynak seç"
                  className="mb-2"
                />
                <TagPicker
                  data={
                    tagValues.length
                      ? tagValues.map((user) => {
                          return {
                            label: user,
                            value: user,
                          };
                        })
                      : []
                  }
                  style={{ width: 300 }}
                  onChange={(e) => onChangeHandler(e)}
                  value={tagValue}
                  // onChange={(filteredUserValue) => setFilteredUsers(filteredUserValue)}
                  placeholder="Kullanıcı seç"
                  className="mb-2"
                />
              </div>
              <div className="col-6 text-right d-flex flex-column align-items-end">
                <DateRangePicker
                  selectedDateHandler={setSelectedDate}
                  selectedDate={selectedDate}
                  style={{ width: 230 }}
                  placement="bottomEnd"
                  className="mb-2"
                />
                <Button
                  appearance="primary"
                  loading={buttonLoading}
                  onClick={calculateUserStats}
                >
                  Kullanıcı Toplam Verileri Hesapla
                </Button>
              </div>
            </div>
            {userCalculation && (
              <div className="d-flex justify-content-end flex-column align-items-end">
                <span className="text-muted">
                  Son hesaplanma zamanı:{' '}
                  {moment(userCalculation.c * 1000).format(
                    'DD/MM/YYYY HH:mm:ss'
                  )}
                </span>
                <span className="text-muted">
                  Şu kaynak için: {userCalculation.src}
                </span>
                <span className="text-muted">
                  Şu aralıkta:{' '}
                  {moment(userCalculation.sd * 1000).format('DD/MM/YYYY')} -
                  {moment(userCalculation.ed * 1000).format('DD/MM/YYYY')}
                </span>
              </div>
            )}
            <Datatable
              title="Kullanıcılar"
              columns={visibleColumns}
              data={users}
              defaultSortField={datatableDefaultSortField}
              pagination
              responsive={true}
              striped={true}
              highlightOnHover={true}
              pointerOnHover={true}
              defaultSortAsc={false}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              onRowClicked={(event) => {
                history.push(`/user/${event.id}`);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;

Number.prototype.round = function (places) {
  return +(Math.round(this + 'e+' + places) + 'e-' + places);
};
