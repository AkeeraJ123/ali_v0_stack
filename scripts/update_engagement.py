import json
import os

# Define the correct path
data_file = "data/engagement.json"

# Ensure the file exists
if not os.path.exists(data_file):
    # Create a new file with default structure
    data = {"instagram": {"likes": 0}, "x": {"likes": 0}, "tiktok": {"likes": 0}}
    with open(data_file, "w") as f:
        json.dump(data, f, indent=4)
else:
    # Load existing engagement data
    with open(data_file, "r") as f:
        data = json.load(f)

# Example: Update Instagram likes
data["instagram"]["likes"] += 10

# Save the updated data
with open(data_file, "w") as f:
    json.dump(data, f, indent=4)

print("Engagement updated successfully!")
