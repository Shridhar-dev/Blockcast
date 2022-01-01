//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Podcasts is ERC721URIStorage{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint casts = 0;

    event NFTMade(uint id);
    event PodcastMade(uint id);
    
    struct Podcast {
        string name;
        string link;
        uint timestamp;
        address author;
        string category;
        uint id;
    }

    Podcast[] public tech;
    Podcast[] public fiction;
    Podcast[] public history;
    Podcast[] public misc;
    Podcast[] public all;

    mapping(address => Podcast[]) public userToPodcasts;
    mapping(string => address) public podcastToUser;
    mapping(string => Podcast) public linkToPodcast;
    mapping(uint => Podcast) public idToPodcast;
    mapping(uint => bool) public podcastToNFT;

    constructor() ERC721("BlockCast", "BC") {

    }

    function makeNFT(string memory tokenURI,uint id) public returns (uint256){
        require(podcastToNFT[id] == false);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        podcastToNFT[id] = true;
        emit NFTMade(id);
        return newItemId;      
    }

    function publishPodcast(
        string memory podcastLink,
        string memory name,
        string memory category
    ) public{
        casts = casts + 1;
        userToPodcasts[msg.sender].push(
            Podcast(
                name,
                podcastLink,
                block.timestamp,
                msg.sender,
                category,
                casts
            )
        );
        podcastToUser[podcastLink] = msg.sender;    
        linkToPodcast[podcastLink] = Podcast(
                name,
                podcastLink,
                block.timestamp,
                msg.sender,
                category,
                casts
        );

        all.push(Podcast(
                name,
                podcastLink,
                block.timestamp,
                msg.sender,
                category,
                casts
        ));

        if(keccak256(bytes(category)) == keccak256(bytes("tech"))){
            tech.push(Podcast(
                name,
                podcastLink,
                block.timestamp,
                msg.sender,
                category,
                casts
            ));
        }
        else if(keccak256(bytes(category)) == keccak256(bytes("fiction"))){
            fiction.push(Podcast(
                name,
                podcastLink,
                block.timestamp,
                msg.sender,
                category,
                casts
            ));
        }
        else if(keccak256(bytes(category)) == keccak256(bytes("history"))){
            history.push(Podcast(
                name,
                podcastLink,
                block.timestamp,
                msg.sender,
                category,
                casts
            ));
        }
        else{
            misc.push(Podcast(
                name,
                podcastLink,
                block.timestamp,
                msg.sender,
                category,
                casts
            ));
        }
        idToPodcast[casts] = Podcast(
                name,
                podcastLink,
                block.timestamp,
                msg.sender,
                category,
                casts
        );
        podcastToNFT[casts] = false;
        emit PodcastMade(casts);
    }

    function getUserPodcasts() public view returns(Podcast[] memory){
        return userToPodcasts[msg.sender];
    }

    function getPodcastsFromId(uint id) public view returns(Podcast memory){
        return idToPodcast[id];
    }
    
    function getUserOfPodcast( string memory url ) public view returns(address){
        return podcastToUser[url];
    }

    function getPodcastFromLink( string memory url ) public view returns(Podcast memory){
        return linkToPodcast[url];
    }

    function getTechPodcasts() public view returns(Podcast[] memory){
        return tech;
    }

    function getFictionPodcasts() public view returns(Podcast[] memory){
        return fiction;
    }
    function getHistoryPodcasts() public view returns(Podcast[] memory){
        return history;
    }
    function getMiscPodcasts() public view returns(Podcast[] memory){
        return misc;
    }

    function getAllPodcasts() public view returns(Podcast[] memory){
        return all;
    }
    
   
    function tip(address author) public payable{
        payable(author).transfer(msg.value);
    }

}