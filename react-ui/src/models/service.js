class Service {
  constructor(item, sourceSite) {
    this.id = `${sourceSite}-${item.id}`;
    this.n = item.name;
    this.prv = item.provider;
    this.src = sourceSite;
  }
}

export default Service;
