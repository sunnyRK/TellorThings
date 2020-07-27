# Automated crypto trade By Tellor decentralized oracles and Uniswap-V2 protocol
# Developed for Unitize-SFBW hackathon 
# Tellor - Best Implementation Into Pre-Existing Project 

# This project is developed during Devfolio event and we are adding more features like,
    - swapExactTokensForTokensSupportingFeeOnTransferTokens (developed during devfolio)
    - swapExactETHForTokensSupportingFeeOnTransferTokens (new feature)
    - swapExactTokensForETHSupportingFeeOnTransferTokens (new feature)

InstCrypt used Tellor Oracles and Uniswap-V2 to set up a trustless automated crypto trading platform without requiring the user to pass minimum return value for safety.

Uniswap works on ERC20-ERC20 pair. So, If you want to trade you need to pass minimum return value for safety, deadline and Path of the token. InstCrypt removes these all hurdles.

Platform calculates the reserve price of pair in uniswap and calculates the tellor oracle price for token pair. And Calculates Slippage rate using these both price. If the Slippage rate satisfied the threshold then platform executes automate trade for trader otherwise it shows the error to perform trade.
note: Slippage refers to the difference between the expected price of a trade and the price at which the trade is executed.

For e.g. From the platform Send 1 DAI to pair(e.g. DAI/KNC) and it will execute a single transaction DAI -> KNC swap for you if the slippage rate <=0.5%(thresold) between liquidity reserve of uniswap and DAI/KNC price feed from tellor oracle.

Even using platform, Liquidity providers can manage pools like they can deposit or sell liquidity to earn interests. But while add liquidity for token pair whatever value you add for one token so parallelly it calculates same price of second token from tellor oracle. So platform will maintain or balance liquidity using tellor price feeds.
 
Platform also saves trade transaction history and provides all transaction details in a single place in platform.

## How was it made?

I have used Tellor Oracles and Uniswap-V2 protocol to build automated trading platform. InstCrypt is supporting a trading crypto pair using Uniswap smart contract and for fetch latest price feed from tellor oracles. So, Using platform liquidity providers can add and remove liquidity and traders can perform trade using smart contract. 

Platform is using web3.js library to interact eith smart contracts. 

I used Next.js and Semantic UI react to design the frontend. And for saving the trade transaction history, I write node.js API and saves history in mongodb database.

## How to run

1. Clone repo `https://github.com/sunnyRK/TellorCreativityThings.git`
2. `cd TellorCreativityThings`
2. `npm install`
3. `node server.js`
4. Currently deployed on Rinkeby Network

## Tech stack

Ethereum   
Solidity   
Web3.js  
Tellor Decentralized Oracles 
Uniswap-V2  
nodejs api  
MongoDB  
Next.Js  
Semantic UI React




