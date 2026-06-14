import sys
from PIL import Image

def analyze_image(path):
    try:
        img = Image.open(path).convert('RGBA')
        data = img.getdata()
        
        non_transparent_pixels = 0
        r_sum = g_sum = b_sum = 0
        
        for item in data:
            if item[3] > 0:  # If not fully transparent
                non_transparent_pixels += 1
                r_sum += item[0]
                g_sum += item[1]
                b_sum += item[2]
                
        if non_transparent_pixels == 0:
            print("Image is fully transparent or empty.")
            return

        r_avg = r_sum / non_transparent_pixels
        g_avg = g_sum / non_transparent_pixels
        b_avg = b_sum / non_transparent_pixels
        
        brightness = (r_avg * 299 + g_avg * 587 + b_avg * 114) / 1000
        print(f"Average color: RGB({int(r_avg)}, {int(g_avg)}, {int(b_avg)})")
        print(f"Average brightness: {brightness:.2f}")
        
        if brightness < 60:
            print("Conclusion: Logo is very dark. Might not be visible on dark theme.")
        elif brightness > 200:
            print("Conclusion: Logo is very bright. Might not be visible on light theme.")
        else:
            print("Conclusion: Logo has medium brightness. Might work on both themes.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_image("logo.png")
