# Generated by Django 3.2.7 on 2021-09-17 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockassist', '0006_rename_user_watchlist_stocks_current_watchlist_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='watchlist_stocks_current',
            name='watchlist_user',
        ),
        migrations.AddField(
            model_name='watchlist_stocks_current',
            name='watchlist_user',
            field=models.CharField(default='NULL_FIELD', max_length=200),
        ),
    ]
