# Generated by Django 4.2.20 on 2025-04-11 16:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("checkout", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="order",
            old_name="address1",
            new_name="street_address1",
        ),
        migrations.RenameField(
            model_name="order",
            old_name="address2",
            new_name="street_address2",
        ),
    ]
