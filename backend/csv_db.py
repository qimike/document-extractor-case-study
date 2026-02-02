import pandas as pd
import os

def append_row_to_csv(csv_path, row_dict):
    df = pd.DataFrame([row_dict])
    write_header = not os.path.exists(csv_path) or os.path.getsize(csv_path) == 0
    df.to_csv(csv_path, mode='a', header=write_header, index=False)