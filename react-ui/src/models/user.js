import moment from 'moment';

class User {
    constructor(
      item
    ) {
        this.id = item.id;
        this.u = item.username;
        this.b = Number(item.balance).round(3);
        this.s = Number(item.spent).round(3);
        this.l = moment(item.lastAuth).unix()
    }
  }
  
  export default User;
  
  Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};