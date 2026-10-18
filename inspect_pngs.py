from PIL import Image
import os
import numpy as np

assets_dir = r"c:\Users\SAHIL\OneDrive\Desktop\babys hackathon\pip-dream-os\public\assets\originals"
files = [f for f in os.listdir(assets_dir) if f.endswith(".png")]

print("=== INSPECTING SUPPLIED PNG ASSETS ===")
for fname in files:
    fpath = os.path.join(assets_dir, fname)
    with Image.open(fpath) as img:
        w, h = img.size
        mode = img.mode
        has_alpha = "A" in mode or "transparency" in img.info
        arr = np.array(img)
        print(f"\nAsset: {fname}")
        print(f"  Dimensions: {w} x {h}")
        print(f"  Mode: {mode}")
        print(f"  Has Alpha Channel: {has_alpha}")
        print(f"  Array shape: {arr.shape}")
        
        # Check corner colors (top-left, top-right, bottom-left, bottom-right)
        tl = arr[0, 0]
        tr = arr[0, -1]
        bl = arr[-1, 0]
        br = arr[-1, -1]
        print(f"  Corners RGB(A):")
        print(f"    TL: {tl}")
        print(f"    TR: {tr}")
        print(f"    BL: {bl}")
        print(f"    BR: {br}")
        
        # Check border variance
        top_row = arr[0, :, :3]
        mean_bg = np.mean(top_row, axis=0)
        std_bg = np.std(top_row, axis=0)
        print(f"  Top row mean RGB: {mean_bg.round(2)}, std: {std_bg.round(2)}")
