from django.db import migrations


IMAGE_BY_TITLE = {
    "The Sweet Science: Understanding Honey's Amazing Properties": "background-honey.png",
    "Taste the Terroir: Exploring the Unique Flavors of Single-Origin Honey": "wildflower-honey.png",
    "Acacia Honey & Berry Parfait": "acacia-honey.png",
    "Buckwheat Honey & Blue Cheese Crostini": "buckwheat-honey.png",
    "Cinnamon Honey Glazed Chicken Wings": "cinnamon-honey.png",
    "Eucalyptus Honey & Lemon Sore Throat Soother": "eucalyptus-honey.png",
    "Ginger Honey Stir-Fry Sauce": "ginger-honey.png",
    "Honey Almond Butter & Banana Toast": "honey-almond-butter.png",
    "Honey BBQ Pulled Pork Sliders": "honey-bbq.png",
    "Honey Balsamic Roasted Brussels Sprouts": "honey-balsamic.png",
    "Honey Caramel Apple Dip": "honey-caramel.png",
    "Hot Honey & Ricotta Pizza": "hot-honey.png",
}


STALE_IMAGE_BY_TITLE = {
    "The Sweet Science: Understanding Honey's Amazing Properties": {
        "blog_images/background-honey_BD9gLM8.jpg",
    },
}


def backfill_featured_images(apps, _schema_editor):
    BlogPost = apps.get_model("blog", "BlogPost")

    for title, image_name in IMAGE_BY_TITLE.items():
        post = BlogPost.objects.filter(title=title).first()
        if not post:
            continue

        current_image = post.featured_image.name if post.featured_image else ""
        stale_images = STALE_IMAGE_BY_TITLE.get(title, set())

        if current_image and current_image not in stale_images:
            continue

        post.featured_image = image_name
        post.save(update_fields=["featured_image"])


def clear_backfilled_featured_images(apps, _schema_editor):
    BlogPost = apps.get_model("blog", "BlogPost")

    for title, image_name in IMAGE_BY_TITLE.items():
        BlogPost.objects.filter(
            title=title,
            featured_image=image_name,
        ).update(featured_image="")


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0004_blogpost_post_type"),
    ]

    operations = [
        migrations.RunPython(
            backfill_featured_images,
            clear_backfilled_featured_images,
        ),
    ]
