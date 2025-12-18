import json

# Load existing engagement data
with open("../data/engagement.json", "r") as f:
    data = json.load(f)

# Example: Update Instagram likes
data["instagram"]["likes"] += 10

# Save the updated data
with open("../data/engagement.json", "w") as f:
    json.dump(data, f, indent=4)

print("Engagement updated successfully!")
