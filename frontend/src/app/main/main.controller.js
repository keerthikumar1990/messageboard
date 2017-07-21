export class MainController {
  constructor ($http) {
    'ngInject';
    this.$http = $http;
    this.getMessage();
  }
  postMessage($http){
    this.$http.post('http://localhost:5000/api/message', {msg: this.message});
  }
  getMessage($http){
    var vm = this;
    this.$http.get('http://localhost:5000/api/message').then(function(result){
        vm.messages = result.data;    
    });
  }

}
