#!/usr/bin/python
import sys
import csv
import json
import argparse


# note: new geojson spec says that all coords must be wgs84 (epsg:4326) and
# reprojection should happen client side

parser = argparse.ArgumentParser(
    description="Classify CSV file using Natural Breaks (Jenks) algorithm."
)

parser.add_argument("input_file", help="input CSV file")
parser.add_argument("output_file", help="input JSON file")
args = parser.parse_args()


name_in = args.input_file
name_out = args.output_file
with open(name_in, "r") as f_in:
    reader = csv.DictReader(f_in)

    res = {"type": "FeatureCollection", "features": []}

    # ipdb.set_trace()
    for row in reader:
        # only copy the following values from CSV
        properties = {
            k: row[k] for k in ("Name", "Address", "Summary description", "Produce")
        }

        coords = row["Location"].strip().split(",")
        (lat, lon) = map(float, coords)

        feature = {
            "type": "Feature",
            "properties": properties,
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
        }
        res["features"].append(feature)

with open(name_out, "w") as f_out:
    json.dump(res, f_out)
