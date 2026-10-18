import os
from PIL import Image
from rembg import remove, new_session

input_dir = r"c:\Users\SAHIL\OneDrive\Desktop\babys hackathon\pip-dream-os\public\assets\originals"
output_dir = r"c:\Users\SAHIL\OneDrive\Desktop\babys hackathon\pip-dream-os\public\assets"

files_to_process = [
    "pip_portrait.png",
    "pip_dream_lantern.png",
    "pip_lullaby_box.png",
    "pip_avatar_cloud.png"
]

print("Initializing rembg session...")
session = new_session("u2net")

for fname in files_to_process:
    in_path = os.path.join(input_dir, fname)
    out_path = os.path.join(output_dir, fname)
    print(f"\nProcessing {fname}...")
    
    with Image.open(in_path) as inp_img:
        # Run AI background removal
        # post_process_mask=True cleans up small mask boundary noise
        out_img = remove(
            inp_img,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=15,
            alpha_matting_erode_size=5,
            post_process_mask=True
        )
        out_img.save(out_path, format="PNG")
        print(f"Saved transparent derivative to {out_path} (size: {out_img.size}, mode: {out_img.mode})")

print("\nAll transparent derivatives successfully generated!")
