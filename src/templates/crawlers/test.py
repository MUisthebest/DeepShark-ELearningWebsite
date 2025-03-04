import pandas as pd

df = pd.read_csv("cplusplus_tutorial.csv")
print(df.loc[1, 'content']) 