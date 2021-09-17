from django.db import models
from django.contrib.auth.models import User
# Create your models here.

#Creating a stock watchlist model with minimal details
class watchlist_stocks_current(models.Model):
    stk_symbol = models.CharField(max_length=50, null=False, default='NULL_FIELD')
    stk_name = models.CharField(max_length=200, null=False, default='NULL_FIELD')
    stk_id = models.IntegerField(default=0)
    watchlist_user = models.ManyToManyField(User)