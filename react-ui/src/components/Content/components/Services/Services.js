import React, { useEffect, useState } from "react";
import { useRouteMatch, Route, Switch, useHistory } from "react-router-dom";
import Datatable from "react-data-table-component";
import API from "../../../../api";
import ServiceDetails from "./ServiceDetails";
import LoadingIndicator from "../../../UI/LoadingIndicator";

const Services = () => {
  console.log("Rendering => Services");
  let history = useHistory();
  let { path, url } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const getServices = async () => {
    const getServicesResponse = await API.get(`/db/services`);
    console.log(getServicesResponse);
    setServices(getServicesResponse);
  };

  const columns = React.useMemo(() => [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      width: "80px",
    },
    {
      name: "Servis Adı",
      selector: "name",
      sortable: true,
      cell: row => {
      return <div data-tag="allowRowEvents">{row.name}</div>
      }
    },
    {
      name: "Sağlayıcı",
      selector: "provider",
      sortable: true,
      maxWidth: '250px'
    },
  ]);

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getServices();
      setLoading(false);
    };
    getter();
  }, []);

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
                  <Datatable
                    title="Servisler"
                    columns={columns}
                    data={services}
                    pagination
                    responsive={true}
                    striped={true}
                    highlightOnHover={true}
                    pointerOnHover={true}
                    onRowClicked={(event) => {
                      setSelectedService(event);
                      history.push(`/services/${event.id}`);
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
                  <ServiceDetails selectedService={selectedService} />
                </div>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </>
  );
};

export default Services;
