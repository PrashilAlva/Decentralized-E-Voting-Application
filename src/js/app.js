App = {
  web3Provider: null,
  contracts: {},
  account:'0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3!=='undefined'){
      App.web3Provider=web3.currentProvider;
      web3=new Web3(web3.currentProvider);
    }
    else{
      App.web3Provider=new Web3.providers.HttpProvider('http://localhost:7545');
      web3=new web3(web3.App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(prashcoin) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(prashcoin);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      App.getData();
    return App.render();
    });
  },
render : function(){
  web3.eth.getCoinbase(function (err, account){
    if(err == null){
      console.log(account);
      console.log(web3.eth.account);
    }
  });
},
getData : function(){
  let text="";
  App.contracts.Election.deployed().then((i)=>{
    app=i;
    return app.candidatesCount();
  }).then((candidatesCount)=>{
    for(var i=1;i<=candidatesCount;i++){
      app.candidates(i).then((candidate)=>{
        text+="<tr><th scope='row'>"+candidate[3]+"</th><td>"+candidate[0]+"</td><td>"+candidate[1]+"</td><td>"+candidate[2]+"</td><td><button type='button' class='btn btn-outline-danger waves-effect' onclick=App.castVote("+candidate[3]+")>Vote</button></td></tr>";
        // console.log(text)
        document.getElementById("tableItems").innerHTML=text;
      })
    }
  })
},

castVote:function(id){
  App.contracts.Election.deployed().then((i)=>{
    app=i;
    return app.addVote(id);
  }).then((transac)=>{
    if(transac.receipt.status=='0x1'){
    alert("Your Vote has been recorded successfully, Thank You!");
    App.reload();
    }
    else
    alert("Sorry, you have already casted your Vote...");
  })
},
reload:function(){
  location.reload();
}
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});