pragma solidity ^0.4.2;

contract Hardware {
    string public serial;
    string public assetTag;
    uint public ramSize;
    uint public hddSize;
    string public userid;

    function Hardware (string _serial, string _assetTag, uint _ramSize, uint _hddSize) {
        serial = _serial;
        assetTag = _assetTag;
        ramSize = _ramSize;
        hddSize = _hddSize;

    }

//    function addLaptop () {
//    }

    function updateHardware (uint newRamSize, uint newHddSize) {
        ramSize = newRamSize;
        hddSize = newHddSize;
    }

    function assignNewAssetTag (string newAssetTag) {
        assetTag = newAssetTag;
    }

    function assignToUser (string _userid) {
        userid = _userid;
        
    }

    function freeLaptop () {
        userid = "";
    }

}