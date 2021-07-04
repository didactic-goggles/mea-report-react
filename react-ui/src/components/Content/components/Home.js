import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
// import Datatable from 'react-data-table-component'
// import Axios from 'axios';

const Home = () => {
  console.log('Rendering => Home');
  const [loading, setLoading] = useState(true);
  // const [userSpents, setUserSpents] = useState([]);
  const getUsersSpents = async () => {
    // const getUsersSpentsResponse = await Axios.get('./data/users/userSpents.json');
    // console.log(getUsersSpentsResponse.data);
    // // setLoading(false);
    // setUserSpents(getUsersSpentsResponse.data);
  };

  // const columns = React.useMemo(() => [
  //     {
  //       name: 'Ad',
  //       selector: 'user',
  //       sortable: true,
  //     },
  //     {
  //       name: 'Harcama',
  //       selector: 'spent',
  //       sortable: true
  //     },
  //     {
  //       name: 'Harcama',
  //       selector: 'quantity',
  //       sortable: true,
  //     },
  //   ], []);

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getUsersSpents();
      setLoading(false);
    };
    getter();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center w-100 justify-content-center mt-auto" style={{ height: '100%' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <h3 className="ml-2">Loading</h3>
      </div>
    );
  }
  return (
    <div>
      <div className="app-page-title">
        <div className="page-title-wrapper">
          <div className="page-title-heading">
            <div className="page-title-icon">
              <i className="pe-7s-car icon-gradient bg-mean-fruit"></i>
            </div>
            <div>
              Analytics Dashboard
              <div className="page-title-subheading">
                This is an example dashboard created using build-in elements and components.
              </div>
            </div>
          </div>
          <div className="page-title-actions">
            <button
              type="button"
              data-toggle="tooltip"
              title="Example Tooltip"
              data-placement="bottom"
              className="btn-shadow mr-3 btn btn-dark"
            >
              <i className="fa fa-star"></i>
            </button>
            <div className="d-inline-block dropdown">
              <button
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                className="btn-shadow dropdown-toggle btn btn-info"
              >
                <span className="btn-icon-wrapper pr-2 opacity-7">
                  <i className="fa fa-business-time fa-w-20"></i>
                </span>
                Buttons
              </button>
              <div tabIndex="-1" role="menu" aria-hidden="true" className="dropdown-menu dropdown-menu-right">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <div className="nav-link">
                      <i className="nav-link-icon lnr-inbox"></i>
                      <span>Inbox</span>
                      <div className="ml-auto badge badge-pill badge-secondary">86</div>
                    </div>
                  </li>
                  <li className="nav-item">
                    <div className="nav-link">
                      <i className="nav-link-icon lnr-book"></i>
                      <span>Book</span>
                      <div className="ml-auto badge badge-pill badge-danger">5</div>
                    </div>
                  </li>
                  <li className="nav-item">
                    <div className="nav-link">
                      <i className="nav-link-icon lnr-picture"></i>
                      <span>Picture</span>
                    </div>
                  </li>
                  <li className="nav-item">
                    <div className="nav-link">
                      <i className="nav-link-icon lnr-file-empty"></i>
                      <span>File Disabled</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-xl-4">
          <div className="card mb-3 widget-content bg-midnight-bloom">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Total Orders</div>
                <div className="widget-subheading">Last year expenses</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span>1896</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card mb-3 widget-content bg-arielle-smile">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Clients</div>
                <div className="widget-subheading">Total Clients Profit</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span>$ 568</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card mb-3 widget-content bg-grow-early">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Followers</div>
                <div className="widget-subheading">People Interested</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span>46%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-xl-none d-lg-block col-md-6 col-xl-4">
          <div className="card mb-3 widget-content bg-premium-dark">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Products Sold</div>
                <div className="widget-subheading">Revenue streams</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-warning">
                  <span>$14M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card">
            <div className="card-header-tab card-header-tab-animation card-header">
              <div className="card-header-title">
                <i className="header-icon lnr-apartment icon-gradient bg-love-kiss"> </i>
                Siparişler
              </div>
            </div>
            <div className="card-body">
              <table id="tableOrders" className="table"></table>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card">
            <div className="card-header-tab card-header-tab-animation card-header">
              <div className="card-header-title">
                <i className="header-icon lnr-apartment icon-gradient bg-love-kiss"> </i>
                En çok harcama yapan kullanıcılar
              </div>
            </div>
            <div className="card-body">
              <table id="tableSpentMost" className="table"></table>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card">
            <div className="card-header-tab card-header-tab-animation card-header">
              <div className="card-header-title">
                <i className="header-icon lnr-apartment icon-gradient bg-love-kiss"> </i>
                En çok kullanılan servisler
              </div>
            </div>
            <div className="card-body">
              {/* <Datatable title="Movie List"
                                columns={columns}
                                data={userSpents}
                                pagination/> */}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-xl-4">
          <div className="card mb-3 widget-content">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-heading">Total Orders</div>
                  <div className="widget-subheading">Last year expenses</div>
                </div>
                <div className="widget-content-right">
                  <div className="widget-numbers text-success">1896</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card mb-3 widget-content">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-heading">Products Sold</div>
                  <div className="widget-subheading">Revenue streams</div>
                </div>
                <div className="widget-content-right">
                  <div className="widget-numbers text-warning">$3M</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card mb-3 widget-content">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-heading">Followers</div>
                  <div className="widget-subheading">People Interested</div>
                </div>
                <div className="widget-content-right">
                  <div className="widget-numbers text-danger">45,9%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-xl-none d-lg-block col-md-6 col-xl-4">
          <div className="card mb-3 widget-content">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-heading">Income</div>
                  <div className="widget-subheading">Expected totals</div>
                </div>
                <div className="widget-content-right">
                  <div className="widget-numbers text-focus">$147</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
