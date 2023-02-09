from django.urls import path
from .views import index, getTransactionList, getTxnDetails, getTokenTxnList, getTokenTxnDetails

urlpatterns = [
    path("", index, name="index"),
    path('getTransactionList', getTransactionList),
    path('getTxnDetails', getTxnDetails),
    path('getTokenTxnList', getTokenTxnList),
    path('getTokenTxnDetails', getTokenTxnDetails),
]
