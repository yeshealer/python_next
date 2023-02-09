# Importing necessary libraries
from django_nextjs.render import render_nextjs_page_sync
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
import requests
import calendar
import time
from moralis import evm_api

# Bscscan API Base URL
bsc_url = 'https://api.bscscan.com/api'
# Bscscan API Key
bsc_api_key = 'AHCXXG173BJJR2NQJKVTAPNX6ZBXRCFSWQ'
# Moralis API Key
moralis_api_key = 'Dtn7MAUqnS4GXJBGinl4TiW4d5IzYzuZRCkN4nhHkLMo9ysx2MJuPUVcGpMn1x6S'
# WBNB token address
WBNB_address = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'


def getTokenPrice(tokenAddress):
    # Getting token price from the Moralis API
    params = {
        "address": tokenAddress,
        "chain": "bsc",
    }
    try:
        result = evm_api.token.get_token_price(
            api_key=moralis_api_key,
            params=params,
        )
        return result['usdPrice']
    except:
        return 0


def getBlockNumber(timeStamp):
    # Getting blocknumber from the Bscscan API
    url = bsc_url + \
        f"?module=block&action=getblocknobytime&timestamp={timeStamp}&closest=before&apikey={bsc_api_key}"
    response = requests.get(url)
    data = response.json()
    return data['result']


def getOnedayBlockArea():
    # Getting current and 24 hours before timestamp
    gmt = time.gmtime()
    ts = calendar.timegm(gmt)
    before24ts = ts - 24 * 60 * 60
    # Getting startblock and endblock from API
    endblock = getBlockNumber(ts)
    startblock = getBlockNumber(before24ts)
    return [startblock, endblock]


@api_view(['GET'])
def getTransactionList(request):
    blockArea = getOnedayBlockArea()
    startBlock = blockArea[0]
    endBlock = blockArea[1]
    # Getting transactionlist from the Bscscan API
    address = request.query_params.get('address')
    url = bsc_url + \
        f"?module=account&action=txlist&address={address}&startblock={startBlock}&endblock={endBlock}&apikey={bsc_api_key}"
    response = requests.get(url)
    data = response.json()
    return Response(data['result'])


@api_view(['GET'])
def getTxnDetails(request):
    # Getting transactionlist from the Moralis API
    txnHash = request.query_params.get('txnHash')
    params = {
        "transaction_hash": txnHash,
        "chain": "bsc",
    }
    result = evm_api.transaction.get_transaction(
        api_key=moralis_api_key,
        params=params,
    )
    return Response(result)


@api_view(['GET'])
def getTokenTxnList(request):
    blockArea = getOnedayBlockArea()
    startBlock = blockArea[0]
    endBlock = blockArea[1]
    # Getting BEP20 token transaction list from the Bscscan API
    tokenAddress = request.query_params.get('tokenAddress')
    walletAddress = request.query_params.get('walletAddress')
    url = bsc_url + \
        f"?module=account&action=tokentx&contractaddress={tokenAddress}&address={walletAddress}&startblock={startBlock}&endblock={endBlock}&apikey={bsc_api_key}"
    response = requests.get(url)
    data = response.json()
    return Response(data['result'])


@api_view(['POST'])
def getTokenTxnDetails(request):
    # Getting current timestamp
    gmt = time.gmtime()
    ts = calendar.timegm(gmt)
    tokenTxnList = request.data['tokenTxnList']
    tokenAddress = request.data['tokenAddress']
    walletAddress = request.data['walletAddress']
    # Initializing Datas
    sellList = []
    buyList = []
    sellAmount = 0
    buyAmount = 0
    bnbPrice = getTokenPrice(WBNB_address)
    tokenPrice = getTokenPrice(tokenAddress)
    first_buy_date = ts
    tokenName = tokenTxnList[0]['tokenName']
    tokenSymbol = tokenTxnList[0]['tokenSymbol']
    # Getting transaction details
    for txn in tokenTxnList:
        if txn['from'].lower() == walletAddress.lower():
            sellList.append(
                {'value': int(txn['value']) / 10 ** int(txn['tokenDecimal'])})
        elif txn['to'].lower() == walletAddress.lower():
            buyList.append(
                {'value': int(txn['value']) / 10 ** int(txn['tokenDecimal'])})
            if first_buy_date > int(txn['timeStamp']):
                first_buy_date = int(txn['timeStamp'])
    for sell in sellList:
        sellAmount += sell['value']
    for buy in buyList:
        buyAmount += buy['value']
    data = [{
        'sellList': sellList,
        'buyList': buyList,
        'tokenPrice': tokenPrice,
        'bnbPrice': bnbPrice,
        'tokenName': tokenName,
        'tokenSymbol': tokenSymbol,
        'totalSellAmount': sellAmount,
        'totalSellAmountBNB': sellAmount * tokenPrice / bnbPrice,
        'totalSellAmountUSD': sellAmount * tokenPrice,
        'totalBuyAmount': buyAmount,
        'totalBuyAmountBNB': buyAmount * tokenPrice / bnbPrice,
        'totalBuyAmountUSD': buyAmount * tokenPrice,
        'firstBuyDate': first_buy_date,
        'totalProfitUSD': (buyAmount - sellAmount) * tokenPrice
    }]
    return Response(data)


def index(request):
    return render_nextjs_page_sync(request)
