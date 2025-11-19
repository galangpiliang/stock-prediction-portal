import os
from django.conf import settings
from matplotlib import pyplot as plt

def save_plot(plot_filename):
    image_path = os.path.join(settings.MEDIA_ROOT, plot_filename)
    plt.savefig(image_path)
    plt.close()
    image_url = f"{settings.MEDIA_URL}{plot_filename}"
    return image_url