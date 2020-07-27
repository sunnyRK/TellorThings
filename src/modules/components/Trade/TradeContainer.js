import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Axios from 'axios';

import web3 from '../../../../config/web3';
import DaiIcon from '../../../assets/icons/dai.svg';
import TrbIcon from '../../../assets/icons/trb.png';
import BatIcon from '../../../assets/icons/bat.svg';
import ZrxIcon from '../../../assets/icons/zrx.svg';
import EthIcon from '../../../assets/icons/eth.png';

import {
  getUniswapV2Pair,
  getUniswapV2Router02,
  getUniswapV2Library,
  getTellorOracle,
  getERCContractInstance,
  TokenInfoArray,
  PairInfoArray,
  tagOptions,
} from '../../../../config/instances/contractinstances';

import Trade from './Trade';

const Tokens = [
  {
    value: 'DAI',
    image: DaiIcon,
  },
  {
    value: 'TRB',
    image: TrbIcon,
  },
  {
    value: 'BAT',
    image: BatIcon,
  },
  {
    value: 'ZRX',
    image: ZrxIcon,
  },
  {
    value: 'WETH',
    image: EthIcon,
  },
];

class TradeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amountSwapDesired: '',
      swapValinWei: 0,
      amountInBalanceText: '0',
      reserve0: '0',
      amountOut: '',
      amountOutWithToken: '',
      tellorRate: '',
      tellorRateWithToken: '',
      pairTokens: [],
      token0: '',
      token1: '',
      minValue: 0, 
      shouldSwap: false,
      pairAddress: '',
      routeraddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      slippage: '',
      // tellorRate: '',
      exceeds: false,
      blocking:false

    };
  }

  async calculateSLippageRateFromTellorOracle() {
    // Fethces Price of Token pair from TELLOR ORACLES
    const oracleInstance = await getTellorOracle(web3);
    const price1 = await oracleInstance.methods.getCurrentValueFromTellorOracle(this.state.token0).call();
    const price2 = await oracleInstance.methods.getCurrentValueFromTellorOracle(this.state.token1).call();

    console.log('Tellor price1: ', price1);
    console.log('Tellor price2: ', price2);

    // const price1 = "1002975"; //DAI
    // const price2 = "206000"; //BAT
    // const price2 = "336600"; //ZRX

    const token0Price = parseInt(price1[1]) / 1000000;
    const token1Price = parseInt(price2[1]) / 1000000;

    // const token0Quantity = (token0Price * 1e18) * this.state.swapValinWei;
    const token0Quantity = (token0Price * 1e18) * (parseInt(this.state.amountSwapDesired));

    const token1Quantity = (token0Quantity * 1e18) / (token1Price * 1e18);

    const difference = token1Quantity / 1e18 - this.state.amountOut;
    console.log('difference ', difference);

    const numerator = difference * 100;
    console.log('numerator ', numerator);

    const slippage = numerator / (token1Quantity / 1e18);
    console.log('slippage is ', slippage);

    let slippage2;
    if (parseFloat(slippage) > parseFloat(0)) {
      slippage2 = `${slippage} %`;
    } else {
      slippage2 = `0 %`;
    }

    this.setState({
      slippage: slippage2,
      tellorRate: token1Quantity / 1e18,
      tellorRateWithToken: token1Quantity/1e18 + " " + this.state.token1
    });
  }

  async getAmountOutValue() {
    console.log(this.state.pairAddress);
    const pairInstance = await getUniswapV2Pair(web3, this.state.pairAddress);
    const reserves = await pairInstance.methods.getReserves().call();
  
      const token0V2Pair = await pairInstance.methods.token0().call();
      const token1V2Pair = await pairInstance.methods.token1().call();
      const libInstance = await getUniswapV2Library(web3);
      // // const amountIn = await libInstance.methods.getAmountIn("100","91566","70966").call();
      // // it gives reserves[1] value
      let amountOut;
      console.log(token0V2Pair, TokenInfoArray[0][this.state.token0].token_contract_address);
      if (token0V2Pair.toLowerCase() == TokenInfoArray[0][this.state.token0].token_contract_address.toLowerCase()) {
        console.log(this.state.swapValinWei, reserves[0], reserves[1], '1');
        amountOut = await libInstance.methods.getAmountOut(this.state.amountSwapDesired, reserves[0], reserves[1]).call();
      } else {
        console.log(this.state.swapValinWei, reserves[1], reserves[0], '2');
        amountOut = await libInstance.methods.getAmountOut(this.state.amountSwapDesired, reserves[1], reserves[0]).call();
      }
      console.log('amountout ', amountOut);
      this.setState({
        amountOut,
        amountOutWithToken: amountOut + " " + this.state.token1
      });
      await this.calculateSLippageRateFromTellorOracle();
  }

  swapExactTokensForTokens = async () => {
    event.preventDefault();
    try {
      this.setState({ shouldSwap: false, blocking: true });
      // check if token is selelcted?
      const pairInstance = await getUniswapV2Pair(web3, this.state.pairAddress);
      const reserves = await pairInstance.methods.getReserves().call();
      console.log(reserves[0]);
      console.log(this.state.swapValinWei)
      if(parseInt(reserves[0]) >= this.state.swapValinWei) {
        if (this.state.token0 != '') {
          // check if trade value is added?
          if (this.state.swapValinWei > 0) {
            const accounts = await web3.eth.getAccounts();

            console.log(this.state.amountOut);
            console.log(this.state.tellorRate);
            if (parseFloat(this.state.amountOut) >= parseFloat(this.state.tellorRate)) {
              // trade directly
              console.log('All set to go');
              this.setState({ shouldSwap: true });
            } else {
              if (parseInt(this.state.slippage) <= 0.9) {
                this.setState({ shouldSwap: true });
              } else {
                console.log('Slippage rate is high');
                console.log('Slippage rate: ', this.state.slippage);
              }
            }

              if (this.state.shouldSwap) {
                // Trade will happen here
                this.setState({ shouldSwap: false });
                const erc20ContractInstance2 = await getERCContractInstance(web3, this.state.token0);

                // check balance
                const balance = await erc20ContractInstance2.methods.balanceOf(accounts[0]).call();
                if (parseInt(balance) >= this.state.swapValinWei) {
                  let allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
                  if (parseInt(allowance) < this.state.swapValinWei) {
                    await erc20ContractInstance2.methods.approve(
                      this.state.routeraddress, // Uniswap router address
                      web3.utils.toWei(this.state.amountSwapDesired.toString(), 'ether'),
                    ).send({
                      from: accounts[0],
                    });
                    allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
                  }
                  // check allowance
                  if (parseInt(allowance) >= parseInt(this.state.amountSwapDesired)) {
                    const routeContractInstance = await getUniswapV2Router02(web3);
                    const transactionHash = await routeContractInstance.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                      web3.utils.toWei(this.state.amountSwapDesired.toString(), 'ether'),
                      this.state.minValue,
                      [TokenInfoArray[0][this.state.token0].token_contract_address, TokenInfoArray[0][this.state.token1].token_contract_address],
                      accounts[0],
                      Math.floor(new Date().getTime() / 1000) + 86400,
                    ).send({
                      from: accounts[0],
                    });
                    // add transation in transaction history
                    const models = {
                      transactionHash: transactionHash.transactionHash,
                      token0: this.state.token0,
                      token1: this.state.token1,
                      pairAddress: this.state.pairAddress,
                      amountIN: this.state.amountSwapDesired,
                      amountOut: this.state.amountOut,
                    };

                    // Axios.post('https://instcrypt-node-api.herokuapp.com/api/createProgram', models)
                    Axios.post('https://instcrypt-node-api.herokuapp.com/api/createTrade', models)
                      .then((res) => {
                        if (res.statusText == 'OK') {
                        } else {
                          console.log(res);
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                        this.setState({ shouldSwap: false, blocking: false });
                      });

                    console.log(transactionHash);
                    toast.success('Trade Successful and transaction added to transaction history!!', {
                      position: toast.POSITION.TOP_RIGHT,
                    });

                    toast.success(`Transaction Hash: ${transactionHash.blockHash}`, {
                      position: toast.POSITION.TOP_RIGHT,
                    });
                  } else {
                    // Insufficeient allowance
                    toast.error(`${this.state.token0} allowance is not given perfectly. Please Try again!`, {
                      position: toast.POSITION.TOP_RIGHT,
                    });
                  }
                } else {
                  // Insufficeient balance
                  toast.error(`Insufficeient ${this.state.token0} balance!`, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
              } else {
                // Slippage rate is high so trade will not be happen
                toast.error('Swap will not be perform, Slippage rate is high!', {
                  position: toast.POSITION.TOP_RIGHT,
                });
              }
            
          } else {
            toast.error('Please add valid value!!', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        } else {
          toast.error('Please select trade pair and token', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        toast.error(`Value ${this.state.amountSwapDesired} exceeds liquidity. Please decrease the value!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      this.setState({ shouldSwap: false, blocking: false });
      this.onClearClick()
    } catch (error) {
      this.setState({ shouldSwap: false, blocking: false });
      console.log(error);
    }
  };
  

  handlePairs = async (e, { value }) => {
    const pair = [
      {
        key: PairInfoArray[0][value].token0,
        text: (
          <div className="align-items">
            <img
              src={
              Tokens.find((token) => token.value === PairInfoArray[0][value].token0).image
              }
              className="ui avatar image"
              alt="coin"
            />
            {PairInfoArray[0][value].token0}
          </div>
        ),
        value: PairInfoArray[0][value].token0,
      },
      {
        key: PairInfoArray[0][value].token1,
        text: (
          <div className="align-items">
            <img
              src={
              Tokens.find((token) => token.value === PairInfoArray[0][value].token1).image
              }
              className="ui avatar image"
              alt="coin"
            />
            {PairInfoArray[0][value].token1}
          </div>
        ),
        value: PairInfoArray[0][value].token1,
      },
    ];

    const accounts = await web3.eth.getAccounts();
    const erc20ContractInstance2 = await getERCContractInstance(web3, PairInfoArray[0][value].token0);
    const amountInBalanceText = await erc20ContractInstance2.methods.balanceOf(accounts[0]).call();

    const pairInstance = await getUniswapV2Pair(web3, PairInfoArray[0][value].pairaddress);
    const reserves = await pairInstance.methods.getReserves().call();

    this.setState({
      tradePairTokens: value,
      pairTokens: pair,
      token0: PairInfoArray[0][value].token0,
      token1: PairInfoArray[0][value].token1,
      pairAddress: PairInfoArray[0][value].pairaddress,
      amountInBalanceText,
      reserve0: reserves[0],
    });
  };

  handlePairTokens = async (e, { value }) => {
    let tempToken2;
    if (value != this.state.token0) {
      tempToken2 = this.state.token0;
    } else {
      tempToken2 = this.state.token1;
    }

    const accounts = await web3.eth.getAccounts();
    const erc20ContractInstance2 = await getERCContractInstance(web3, value);
    const amountInBalanceText = await erc20ContractInstance2.methods.balanceOf(accounts[0]).call();
    this.setState({ token0: value, token1: tempToken2, amountInBalanceText });
  };

  handleInputPrice = async (e, { value }) => {
    if (this.state.token0 != '') {
      // this.setState({
      //   amountSwapDesired: event.target.value,
      //   amountOut: 'Wait...',
      //   tellorRate: 'Wait...',
      //   slippage: 'Wait...',
      // });

      let swapValinWei = 0;
      if(parseInt(event.target.value) > 0){
        swapValinWei = web3.utils.toWei(event.target.value.toString(), 'ether');
        this.setState({
          amountSwapDesired: event.target.value,
          amountOut: 'Wait...',
          amountOutWithToken: 'Wait...',
          tellorRate: 'Wait...',
          tellorRateWithToken: 'Wait...',
          slippage: 'Wait...',
          swapValinWei
        });
        await this.getAmountOutValue();
      } else {
        this.setState({
          amountSwapDesired: event.target.value,
          amountOut: '0',
          amountOutWithToken: '0',
          tellorRate: '0',
          tellorRateWithToken: '0',
          slippage: '0',
          swapValinWei: 0
        });
      }

    } else {
      alert('Please select token among pair.');
    }
  }

  handleState = (value, callback) => {
    this.setState(value, () => {
      if (callback) callback();
    });
  }

  onClearClick = () => {
    this.setState({
      tradePairTokens: '',
      amountSwapDesired: '',
      amountOut: '',
      amountOutWithToken: '',
      tellorRate: '',
      tellorRateWithToken: '',
      slippage: '',
      amountInBalanceText: '0',
      token0: '',
      token1: '',
      reserve0: '0',
    });
  }

  render() {
    const {
      tradePairTokens, pairTokens, amountSwapDesired, amountOut, slippage, 
      tellorRate, amountInBalanceText, token0, reserve0, blocking, tellorRateWithToken, amountOutWithToken
    } = this.state;
    return (
      <Trade
        handleState={this.handleState}
        tagOptions={tagOptions}
        tradePairTokens={tradePairTokens}
        pairTokens={pairTokens}
        amountSwapDesired={amountSwapDesired}
        amountOut={amountOut}
        amountOutWithToken={amountOutWithToken}
        tellorRate={tellorRate}
        tellorRateWithToken={tellorRateWithToken}
        slippage={slippage}
        swapExactTokensForTokens={this.swapExactTokensForTokens}
        handlePairs={this.handlePairs}
        handlePairTokens={this.handlePairTokens}
        handleInputPrice={this.handleInputPrice}
        onClearClick={this.onClearClick}
        amountInBalanceText={amountInBalanceText}
        token0={token0}
        reserve0={reserve0}
        blocking={blocking}
      />
    );
  } 
}

export default TradeContainer;
