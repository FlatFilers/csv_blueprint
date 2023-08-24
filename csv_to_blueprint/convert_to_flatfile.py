import os
import csv
import json


def remove_bom(text):
    """Remove Byte Order Mark (BOM) if it exists."""
    BOM_UTF8 = "\ufeff"
    if text.startswith(BOM_UTF8):
        return text[len(BOM_UTF8) :]
    return text


def csv_to_flatfile_blueprint(file_path, sheet_name, sheet_slug):
    with open(file_path, "r", encoding="utf-8-sig") as csv_file:
        reader = csv.reader(csv_file)

        # Extract headers and attributes
        headers = next(reader)
        required_attrs = next(reader)
        type_attrs = next(reader)

        fields = []
        for header, req_attr, type_attr in zip(headers, required_attrs, type_attrs):
            header = remove_bom(header)  # Remove BOM if present
            field = {}

            # Set key, label, and type
            field["key"] = header.replace(" ", "_").lower()
            field["label"] = header

            # Determine type based on type_attr
            if "Date" in type_attr:
                field["type"] = "date"
            elif "Number" in type_attr:
                field["type"] = "number"
            elif "Boolean" in type_attr:
                field["type"] = "boolean"
            else:
                field["type"] = "string"

            # Check if the field is required
            if "Required" in req_attr:
                field["constraints"] = [{"type": "required"}]

            fields.append(field)

        blueprint = {"name": sheet_name, "slug": sheet_slug, "fields": fields}

        return blueprint


def update_index_file(sheet_slug):
    index_file_path = "/Users/colinfrederickson/Documents/GitHub/platform-sdk-starter/csv_blueprint/src/blueprints/index.ts"
    with open(index_file_path, "a") as index_file:
        index_file.write(f'export * from "./sheets/{sheet_slug}";\n')


# Look for any .csv file in the current directory
csv_files = [f for f in os.listdir(".") if os.path.isfile(f) and f.endswith(".csv")]

if not csv_files:
    print("No CSV files found in the current directory.")
    exit(1)

file_path = csv_files[0]  # Use the first .csv file found

# Extract sheet name from the filename (without the .csv extension)
sheet_name = os.path.splitext(os.path.basename(file_path))[0]
# Convert the sheet name to a slug (lowercase, replace spaces with underscores)
sheet_slug = sheet_name.lower().replace(" ", "_")

blueprint = csv_to_flatfile_blueprint(file_path, sheet_name, sheet_slug)

# Save the blueprint to a file in the specified directory
output_path = f"/Users/colinfrederickson/Documents/GitHub/platform-sdk-starter/csv_blueprint/src/blueprints/sheets/{sheet_slug}.ts"
with open(output_path, "w") as output_file:
    output = f"""import {{ Flatfile }} from "@flatfile/api";

export const {sheet_slug}Sheet: Flatfile.SheetConfig = {json.dumps(blueprint, indent=4)};
"""
    output_file.write(output)

print(f"Blueprint saved to {output_path}")

# Update the index.ts with the new blueprint reference
update_index_file(sheet_slug)
