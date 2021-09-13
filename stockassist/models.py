from django.db import models
from django.contrib.auth.models import User
# Create your models here.

#Creating a stock watchlist model with minimal details
class watchlist_stocks_current(models.Model):
    stock_symbol = models.CharField(max_length=50, default='NULL_STOCK')
    company = models.CharField(max_length=200, default='NULL_STOCK')
    open = models.FloatField(null=False)
    PE_ratio = models.CharField(default='null',max_length=20)
    Mktcap =  models.IntegerField(default=0)
    Avg_vol = models.IntegerField(default=0)
    Yield = models.FloatField(default=-100)
    EPS = models.CharField(default='null',max_length=20)
    current_price = models.FloatField(null=False)
    prev_price = models.FloatField(null=False)
    beta = models.FloatField(null=False, default=-1.0)
    user_link = models.ManyToManyField(User)