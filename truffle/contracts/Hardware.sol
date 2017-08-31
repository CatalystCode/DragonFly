pragma solidity ^0.4.2;

contract Hardware {
    address _owner;

    string public serial;
    string public assetTag;
    uint public ramSize;
    uint public hddSize;
    string public userid;

    function Hardware(string _serial, string _assetTag, uint _ramSize, uint _hddSize, string _userid) {
        _owner = msg.sender;
        serial = _serial;
        assetTag = _assetTag;
        ramSize = _ramSize;
        hddSize = _hddSize;
        userid = _userid;
    }

    function updateHardware (uint newRamSize, uint newHddSize, string  _userid) {
        if (msg.sender != _owner) {
            revert();
        }

        ramSize = newRamSize;
        hddSize = newHddSize;
        userid = _userid;
    }

    function assignToUser (string _userid) {
        if (msg.sender != _owner) {
            revert();
        }

        userid = _userid;
    }

    function freeLaptop () {
        if (msg.sender != _owner) {
            revert();
        }

        userid = "";
    }
}
