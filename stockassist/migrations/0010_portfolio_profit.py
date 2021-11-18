# Generated by Django 3.2.7 on 2021-11-16 17:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockassist', '0009_watchlist_stocks_current_stk_price'),
    ]

    operations = [
        migrations.CreateModel(
            name='portfolio_profit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('watchlist_user', models.CharField(default='NULL_FIELD', max_length=200)),
                ('stock', models.CharField(default='NULL_FIELD', max_length=50)),
                ('price_purchased', models.FloatField(default=-1.0)),
                ('num_stocks', models.IntegerField(default=0)),
            ],
        ),
    ]