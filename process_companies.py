import json
import os
from pathlib import Path
from collections import defaultdict

#https://www.dsaprep.dev/leetcode_questions_by_company.json

input_file = "leetcode_questions_by_company.json"
company_dir = Path("company_questions")
topic_dir = Path("topic_questions")
difficulty_dir = Path("difficulty_questions")

company_dir.mkdir(exist_ok=True)
topic_dir.mkdir(exist_ok=True)
difficulty_dir.mkdir(exist_ok=True)

with open(input_file, "r") as f:
    data = json.load(f)

# Prepare containers
company_map = defaultdict(list)
topic_map = defaultdict(list)
difficulty_map = defaultdict(list)

for q in data:
    # Skip empty or malformed entries
    if not q.get("company") or not q.get("title"):
        continue
    company_map[q["company"]].append(q)
    difficulty_map[q["difficulty"].upper()].append(q)
    for tag in q.get("tags", []):
        topic_map[tag].append(q)

# Write company files
for company, questions in company_map.items():
    fname = company_dir / f"{company.replace(' ', '_')}.json"
    with open(fname, "w") as f:
        json.dump(questions, f, indent=2)

# Write topic files
for topic, questions in topic_map.items():
    fname = topic_dir / f"{topic.replace(' ', '_')}.json"
    with open(fname, "w") as f:
        json.dump(questions, f, indent=2)

# Write difficulty files
for diff, questions in difficulty_map.items():
    fname = difficulty_dir / f"{diff}.json"
    with open(fname, "w") as f:
        json.dump(questions, f, indent=2)

# Write companies list file
company_dir = "company_questions"
companies = [f[:-5].replace("_", " ") for f in os.listdir(company_dir) if f.endswith(".json")]
with open(os.path.join(company_dir, "companies.json"), "w") as f:
    json.dump(companies, f)

print(f"Companies: {len(company_map)}, Topics: {len(topic_map)}, Difficulties: {len(difficulty_map)}")
print("Done! JSONs are in company_questions/, topic_questions/, difficulty_questions/")