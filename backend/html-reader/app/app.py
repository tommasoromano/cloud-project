from fastapi import FastAPI
import requests
from bs4 import BeautifulSoup
import pandas as pd

app = FastAPI()

@app.get("/html/{website_url}")
async def read_html(website_url: str):
    def to_float(s):
        if ':' in s:
            m,s = s.split(':')
            return float(m)*60 + float(s)
    url='https://time2race.mywer.it/gara-live.php?id_circuito=20'
    resp=requests.get(url)
    df = pd.DataFrame({'Pos':[],'N':[],'Driver':[],'Laps':[],'Last Lap':[],'Best Lap':[],'Diff':[],'Transponder':[],'Event':[],'Race Time':[],'Timestamp':[]})
    if resp.status_code==200:
        soup=BeautifulSoup(resp.text,'html.parser')
        t=soup.find("span",{"class":"circuito_racetime"})
        t = str(t).split('">')[1].split("</")[0]
        ts = to_float(t)
        l=soup.find("div",{"class":"tb-container","id":"lista-piloti"})
        for i in l.findAll("div",{"class":"lista_atleti row"}):
            teamid = int(str(i).split('transponder=')[1].split('style')[0][:-3])
            eventid = int(str(i).split('id_evento=')[1].split('&')[0])
            txt = i.text.replace('\n',',').replace(' ', '').replace(',,',',').replace(',,',',')
            splt = txt.split(',')
            try:
                df.loc[len(df.index)] = (splt[1],splt[2],splt[3],splt[5],to_float(splt[6]),to_float(splt[7]),to_float(splt[9]),teamid,eventid,t,ts)
            except Exception as e:
                print(e)
    return f.to_json()