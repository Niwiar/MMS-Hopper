## Installation
1. Install node.js
2. cmd.exe on service directory, run "npm i"
3. Config Database User, Password in file .env
4. run start.bat

## Hopper Report Services API
1. Hopper List:
     GET http://localhost:3000/hopper/record/list?FromDate=<YYYY-MM-DD>&ToDate=<YYYY-MM-DD>
     > # Response
     > [
     >   {
     >     "Index" : "1",
     >     "ProdDate" : "2023-11-28",
     >     "ProdDateShow" : "28-11-2023",
     >     "RecpNameID" : 10,
     >     "RecpName" : "KF BOI3",
     >     "LotNo" : "23E2112801"
     >   },
     > ]
2. Hopper Report:
     GET http://localhost:3000/hopper/record/report?ProdDate=<YYYY-MM-DD>&RecpNameID=<RecpNameID>
     > # Response
     > {
     >     "FilePath": "C:\\Working\\Project\\Ajinomoto\\MMS Hopper\\public\\temp\\HopperReport.xlsx"
     > },

