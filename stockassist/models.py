from django.db import models
# Create your models here.

#Creating a stock watchlist model with minimal details
class watchlist_stocks_current(models.Model):
    stk_symbol = models.CharField(max_length=50, null=False, default='NULL_FIELD')
    stk_name = models.CharField(max_length=200, null=False, default='NULL_FIELD')
    stk_price = models.FloatField(null=False, default=-1.0)
    watchlist_user = models.CharField(max_length=200, null=False, default='NULL_FIELD')