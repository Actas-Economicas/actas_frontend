export default class Backend {
  static backEndUrl = 'http://fce.unal.edu.co/actas';
  //static backEndUrl = "http://127.0.0.1:8000/council_minutes/";

  static openLink(url) {
    window.open(this.backEndUrl + url, "_blank");
  }

  static sendRequest(method, path, body) {
    return this._request(
      method,
      path,
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("jwt")
      },
      body
    );
  }

  static sendLogin(username, password) {
    return this._request(
      "POST",
      "login",
      {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      {
        username: username,
        password: password
      }
    );
  }

  static _request(method, path, headers, body) {
    let answer = fetch(this.backEndUrl + path, {
      method: method,
      headers: headers,
      body: JSON.stringify(body)
    });
    answer.then(res => {
      if (res.status=== 401) {
        localStorage.removeItem("jwt");
        window.location.reload();
      }
    });
    return answer;
  }
}
