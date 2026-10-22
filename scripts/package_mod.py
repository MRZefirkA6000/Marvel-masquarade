import os
import zipfile
import hashlib

mod_source = "mod_build/midnight_rivals"
output_zip = "midnight_rivals.zip"

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(mod_source):
        for file in files:
            full_path = os.path.join(root, file)
            # Archive path should be relative to mod root
            arc_name = os.path.relpath(full_path, "mod_build")
            zipf.write(full_path, arc_name)

size = os.path.getsize(output_zip)
with open(output_zip, 'rb') as f:
    sha256 = hashlib.sha256(f.read()).hexdigest()

print(f"Created {output_zip}: size={size} bytes, sha256={sha256}")
