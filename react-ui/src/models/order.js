import moment from 'moment';

class Order {
  constructor(
    id,
    externalId,
    user,
    charge,
    cost,
    link,
    startCount,
    quantity,
    serviceId,
    serviceName,
    status,
    remains,
    created,
    provider,
    mode
  ) {
    this.id = id;
    this.e_id = externalId;
    this.user = user;
    this.charge = Number(charge).round(3);
    this.cost = Number(cost).round(3);
    this.link = link;
    this.st_count = startCount;
    this.qt = quantity;
    this.s_id = serviceId;
    this.s_name = serviceName;
    this.status = status;
    this.remns = remains;
    this.created = moment(created).unix();
    this.prv = provider;
    this.mode = mode;
  }
}

export default Order;

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};
