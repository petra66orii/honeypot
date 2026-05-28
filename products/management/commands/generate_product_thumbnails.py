from django.core.management.base import BaseCommand

from products.models import Product


class Command(BaseCommand):
    help = "Generate lightweight product thumbnails for existing products."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Regenerate thumbnails even when a thumbnail already exists.",
        )

    def handle(self, *args, **options):
        force = options["force"]
        products = Product.objects.exclude(image="")

        created = 0
        skipped = 0

        for product in products.iterator():
            if not product.image:
                skipped += 1
                continue

            if product.image_thumbnail and not force:
                skipped += 1
                continue

            product.generate_thumbnail()
            created += 1
            self.stdout.write(
                self.style.SUCCESS(f"Generated thumbnail for {product.name}")
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Generated {created} thumbnail(s), skipped {skipped}."
            )
        )
