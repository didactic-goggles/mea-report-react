class User {
  constructor(item, sourceSite) {
    this.id = `${sourceSite}-${item.name}`;
    this.u = item.name;
    this.src = sourceSite;
  }
}

export default User;
