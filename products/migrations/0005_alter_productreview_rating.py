# Generated by Django 4.2.20 on 2025-04-02 21:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0004_productreview"),
    ]

    operations = [
        migrations.AlterField(
            model_name="productreview",
            name="rating",
            field=models.FloatField(
                choices=[
                    (0.5, "0.5 ★"),
                    (1, "1 ★"),
                    (1.5, "1.5 ★"),
                    (2, "2 ★"),
                    (2.5, "2.5 ★"),
                    (3, "3 ★"),
                    (3.5, "3.5 ★"),
                    (4, "4 ★"),
                    (4.5, "4.5 ★"),
                    (5, "5 ★"),
                ]
            ),
        ),
    ]
