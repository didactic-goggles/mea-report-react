import moment from 'moment';

class User {
    constructor(
      id,
      username,
      email,
      skype,
      balance,
      spent,
      status,
      created,
      lastAuth
    ) {
        this.id = id;
        this.user = username;
        this.email = email;
        this.tel = skype;
        this.balance = Number(balance).round(3);
        this.spent = Number(spent).round(3);
        this.status = status;
        this.created = moment(created).unix();
        this.lAuth = moment(lastAuth).unix()
    }
  }
  
  export default User;
  
  Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};