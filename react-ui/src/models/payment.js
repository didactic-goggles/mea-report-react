import moment from 'moment';

class Payment {
  constructor(
    id,
    user,
    balance,
    amount,
    method,
    status,
    created,
    completed,
    ip,
    mode
  ) {
    this.id = id;
    this.user = user;
    this.balance = Number(balance).round(3);
    this.amount = Number(amount).round(3);
    this.method = method;
    this.status = status;
    this.created = moment(created).unix();
    this.completed = moment(completed).unix();
    this.ip = ip;
    this.mode = mode;
  }
}

export default Payment;

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};
