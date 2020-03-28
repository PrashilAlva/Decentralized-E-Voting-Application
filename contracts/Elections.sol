pragma solidity >=0.4.21 <0.7.0;

contract Election {
    struct Candidate {
        string name;
        string part;
        uint voteCount;
        uint id;
    }

    mapping(uint => Candidate) public candidates;
    uint public candidatesCount=0;

    constructor() public {
        candidates[1] = Candidate("A", "Beta", 0, ++candidatesCount);
        candidates[2] = Candidate("B", "Gamma", 0, ++candidatesCount);
    }

    struct Voter {
        address account;
        uint valid;
        uint id;
    }

    mapping(address => Voter) public voters;

    modifier isValid() {
        require(voters[msg.sender].valid != 1,"Sorry, you have already voted once...");
        _;
    }

    function getCandidatesCount() public returns(uint){
        return candidatesCount;
    }
    function addVote(uint _id) public isValid() returns (uint) {
        voters[msg.sender] = Voter(msg.sender,1,_id);
        candidates[_id].voteCount++;
        return candidates[_id].voteCount;
    }

}
