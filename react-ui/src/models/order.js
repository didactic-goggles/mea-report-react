/* eslint-disable no-extend-native */
import moment from 'moment';

class Order {
  constructor(
    item, sourceSite
  ) {
    this.id = item.id;
    this.u = `${sourceSite}-${item.user}`;
    this.e = Number(item.charge).round(3);
    this.c = Number(item.cost).round(3);
    // this.q = Number(item.quantity);
    this.s = `${sourceSite}-${item.service_id}`;
    this.d = moment(item.created).unix();
    this.f = item.fileId;
  }
}

export default Order;

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};
