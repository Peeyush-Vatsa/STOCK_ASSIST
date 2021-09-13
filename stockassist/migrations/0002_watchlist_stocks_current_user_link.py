# Generated by Django 3.2.7 on 2021-09-11 12:29

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stockassist', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchlist_stocks_current',
            name='user_link',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]