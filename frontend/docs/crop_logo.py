import sys
from PIL import Image

def trim(image_path):
    img = Image.open(image_path).convert("RGBA")
    
    alpha = img.split()[-1]
    alpha_mask = alpha.point(lambda p: p > 10 and 255)
    bbox_trans = alpha_mask.getbbox()
    
    if bbox_trans:
        img_cropped = img.crop(bbox_trans)
        img_cropped.save(image_path)
        print(f"Image cropped successfully using alpha bounding box. New size: {img_cropped.size}")
    else:
        print("Bounding box not found.")

if __name__ == "__main__":
    trim("logo.png")
