const myHubName = 'Krasikov-94';
class DogsApi {
  constructor(apiName) {
    this.url = `https://cats.petiteweb.dev/api/single/${apiName}`;
  }
  getAllDogs() {
    return fetch(`${this.url}/show`);
  }
  getCurrentDog(id) {
    return fetch(`${this.url}/show/${id}`);
  }
  newDog(data) {
    return fetch(`${this.url}/add`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  updateDog(id, data) {
    return fetch(`${this.url}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  deleteDog(id) {
    return fetch(`${this.url}/delete/${id}`, {
      method: 'DELETE',
    });
  }
}
const api = new DogsApi(myHubName);
