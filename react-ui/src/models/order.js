/* eslint-disable no-extend-native */
import moment from 'moment';

class Order {
  constructor(
    item, sourceSite
  ) {
    this.id = item.id;
    this.u = `${sourceSite}-${item.user}`;
    this.chg = Number(item.charge).round(3);
    this.cost = Number(item.cost).round(3);
    this.qt = Number(item.quantity);
    this.sid = `${sourceSite}-${item.service_id}`;
    this.d = moment(item.created).unix();
    this.prv = item.provider;
    this.src = sourceSite;
  }
}

export default Order;

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};
