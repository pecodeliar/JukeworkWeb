# Generated by Django 4.1.7 on 2023-03-18 12:40

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='creation_date',
            field=models.DateField(default=datetime.datetime(2023, 3, 18, 12, 40, 14, 7853, tzinfo=datetime.timezone.utc)),
        ),
    ]