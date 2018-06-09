#!/usr/bin/python
import os
import fnmatch
import time
import json
import urllib2
import urllib
import operator
import sys, getopt
import datetime
import socket
import fcntl
import struct
from datetime import datetime
from math import log10, floor

class result:
   #def __init__(self, testName,description, status,moduleName,failureReason,timeStamp,durationn,exception,reboot,logFile,panelid,testMachine,deviceId,deviceType):
   def __init__(self,testId,testName,description, status,moduleName,failureReason,timeStamp,duration,logFile,panel,testMachine):
   
      self.testId=testId
      self.testName = testName
      self.description=description
      self.status=status
      self.moduleName=moduleName
      #-------Result------------------
      self.panel=panel
      self.failureReason=failureReason
      self.timeStamp=timeStamp
      self.duration=duration
      #self.exception=exception
      #self.reboot=reboot
      self.logFile=logFile
      self.testMachine=testMachine
      #self.deviceId=deviceId
      #self.deviceType=deviceType


def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

def usage():
    print "Warning: Flag Error"

def round_sig(x, sig):
    try:                                
        return round(x, sig-int(floor(log10(x)))-1) 
    except :           
        return x


def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

#---Traverse a directory------------------------------------------------------------------------------------------

def pywalker(path,listoflist):
    testName,moduleName,url="","",""
    i=0
    for root, dirs, files in os.walk(path):
        valueList = []
        for file_ in files:

            if fnmatch.fnmatch(file_,'test-name'):
                timeStamp=os.path.basename(os.path.normpath(root))
                if timeStamp != "browsercrash":
                    timeStamp=datetime.strptime(timeStamp, '%Y-%m-%d_%H.%M.%S')
                fileName=os.path.join(root, file_)
                #print fileName
                file = open(fileName)
                data = file.read()
                str1,str2,str3=data,"/",".py"
                sindex=str1.find(str2)+1
                eindex=str1.find(str3)
                #ModuleName
                moduleName=str1[sindex:eindex]
                print moduleName
                #testtitle
                testName=str1[eindex+5:len(str1)-1]
                print testName

            elif fnmatch.fnmatch(file_,'duration'):
                fileName=os.path.join(root, file_)
                #print fileName
                file = open(fileName)
                data = file.read()
                duration=data
                print "duration"
                print duration

            elif fnmatch.fnmatch(file_,'exit-status'):
                fileName=os.path.join(root, file_)
                #print fileName
                file = open(fileName)
                data = file.read()
                if data == "0\n":
                  status="pass"
                else:
                  status="fail"
                print status

            elif fnmatch.fnmatch(file_,'failure-reason'):
                fileName=os.path.join(root, file_)
                #print fileName
                file = open(fileName)
                data = file.read()
                failureReason=data
                print failureReason



            elif fnmatch.fnmatch(file_,'index.html'):
                print "we are here"
                logFile=os.path.join(root, file_)
                print logFile

           
        panel=os.path.basename(os.path.normpath(path))
        #timeStamp=os.path.basename(os.path.normpath(path))
        testMachine=str(get_ip_address())
        description="abcde"
        testId="123"


        if(testName != "" and timeStamp != "browsercrash"):
          tmpObj = result(testId,testName,description, status,moduleName,failureReason,timeStamp,duration,logFile,panel,testMachine)
          post_request(tmpObj)
        testId=str(int(testId)+1)
          #listoflist.append(tmpObj)

        


#--------------------------------------------------------------------------------------------------------------
#HTML CSS

def produceHTML(listoflist,targetPath):
  #print targetPath
  #outfile = open(os.path.join(targetPath+"Result.html"), "w")
  targetPath+="/Result.html"
  outfile = open(targetPath, "w")
  print >>outfile, """
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>MockingBird Automation Testing Results</title>
  <style type="text/css">body { 
    margin:0; 
    padding:20px; 
    font:15px "Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, sans-serif;
    }
  
  p,
  table, caption, td, tr, th {
    margin:0;
    padding:0;
    font-weight:normal;
    }

  p {
    margin-bottom:15px;
    }
  
  table {
    border-collapse:collapse;
    margin-bottom:15px;
    width:75%;
    }
  
  caption {
    text-align:center;
    font-size:22px;
    padding-bottom:10px;
    font-weight: bold;
    color: green;
    }
  
  table td,
  table th {
    padding:5px;
    border:1px solid #fff;
    border-width:0 1px 1px 0;
    }
    
  thead th {
    background:#91c5d4;
    }
      
    thead th[colspan],
    thead th[rowspan] {
      background:#66a9bd;
      }
    
  tbody th,
  tfoot th {
    text-align:center;
    background:#91c5d4;
    }
    
  tbody td,
  tfoot td {
    text-align:center;
    background:#d5eaf0;
    }

  table td.price {
    text-align: left;
    } 
    
  tfoot th {
    background:#b0cc7f;
    }
    
  tfoot td {
    background:#d7e1c5;
    font-weight:bold;
    }
      
  tbody tr.odd td { 
    background:#bcd9e1;
    }</style><script type="text/javascript" src="jquery-1.2.6.min.js"></script>
  <script type="text/javascript" src="automation-table.js"></script>
  </head>
  <body>

  <table id="automation-table" summary="">

    <caption>MockingBird Automation Testing Results</caption>
    
      <thead>    
        <tr>
            <th scope="col" rowspan="2">#</th>
            <!-- <th scope="col" colspan="1"></th> -->
            <th scope="col" colspan="4">Test Case Results</th>
            <!-- <th scope="col" colspan="1"></th> -->
        </tr>
        
        <tr>
            <th scope="col">Test</th>
            <th scope="col">Mean (second)</th>
            <!-- <th scope="col">Standard Deviation</th> -->
            <!-- <th scope="col">Link</th> -->
            <!-- <th scope="col">Test Time</th> -->
        </tr>        
      </thead>
      <tbody>
  """
  #---------------------------------------------Printing the table------------------------------------------------
  var=1
  for item in listoflist:
      if(item.testResult==sys.maxint):
          result="Error"
      else:
          result=str(item.testResult)
      print >>outfile, """<tr><td>"""+str(var)+"""</td><td class="price"><a href="""+item.url+""">"""+item.testName+"""</a></td><td>"""+result+"""</td></tr>"""
      var+=1    
    
            
  #---------------------------------------------------------------------------------------------------------------

  print >>outfile, """
    </tbody>
    <tfoot>
      <tr>
          <th scope="row" colspan="7">If there are any discrepancies, please contact Anil Arrabole/Kiran Adimatyam</th>            
        </tr>
    </tfoot>
  </table>
  """

  print >>outfile, """
  </body></html>
  <table border="1">"""

#--------------------HTTP Post Requst ------------------------------------------------------------------

#def post_request(listoflist,curtime,testCase_dict):
def post_request(resultObj):
    '''
      data= {
      "testId":"3",
      "title":"hihihihi",
      "description":"irving123",
      "moduleName":"444",
      "lastRunOn":"2069",
      "results":[
        {"firstName":"John", "lastName":"Doe"}],
      "testMachine":"Ubuntu"
    
      }
    '''

    #url="http://Stbtester.ctlabs.verizon.net:3000/api/tests/"
    #url="http://localhost:8000/api/tests/9"
    url = "http://localhost:8000/api/tests/%s" % resultObj.testName

    #payload = "{\n \"testId\":\"12\",\n \"title\":\"chirag\",\n \"description\":\"irving123\",\n \"moduleName\":\"444\",\n \"lastRunOn\":\"2069\",\n \"results\":[\n    {\"status\":\"pass\", \"failureReason\":\"None\",\"timeStamp\":\"2-3-2016\",\"duration\":\"3s\",\"logFile\":\"yahoo.com\",\"panelId\":\"123\",\"testMachine\":\"12.123.23.45\"}]\n    \n}\n"
    payload = "{\n \"testId\":\"9\",\n \"title\":\""+resultObj.testName+"\",\n \"description\":\""+resultObj.description+"\",\n \"moduleName\":\""+resultObj.moduleName+"\",\n \"results\":[\n    {\"status\":\""+resultObj.status+"\", \"failureReason\":\"None\",\"timeStamp\":\""+str(resultObj.timeStamp)+"\",\"duration\":\"3s\",\"logFile\":\""+resultObj.logFile+"\",\"panelId\":\""+resultObj.panel+"\",\"testMachine\":\""+resultObj.testMachine+"\"}]\n    \n}\n"

    
    headers = {
         'content-type': "application/json",
         'cache-control': "no-cache",
         'postman-token': "206ffbce-0f66-1c64-0a92-624cc204d71a"
    }

    request = urllib2.Request(url, data=payload, headers=headers)

    response = urllib2.urlopen(request)

    html = response.read()


    print html

#-------------------------------------------------------------------------------------------------------

def main(agr):
  '''
  argv=sys.argv[1:]
  testFile=argv[2]
  try:                                
        opts, args = getopt.getopt(argv, "hgc:d",) 
  except getopt.GetoptError:           
        usage()                          
        sys.exit(2)
  '''
  listoflist = []
  
  testCase_dict  = {
            'Menu_Launch_Time_without_VOD_Poster': 1,
            'Guide_Launch_Time_without_PIP': 2,
            'DVR_Launch': 3,
            'VODLaunchTimeWithoutBarker': 4,
            'infoLaunchWithRightSideTime': 5,
            'infoLaunchWithoutRightSideTime': 6,
            'HD_To_HD_Channel_Change': 7,
            'SD_To_SD_Channel_Change': 8,
            'SD_To_HD_Channel_Change':9,
            'HD_To_SD_Channel_Change': 10,
            'channelChangeTime': 11
            
  }





  
  curPath=os.path.dirname(os.path.abspath(__file__))+"/"
  curtime=str(time.strftime("%Y.%m.%d"))+"_"+str(time.strftime("%H.%M.%S"))
  print curPath
  print curtime
  '''
  os.mkdir(os.path.join(curPath, curtime))
  curPath=os.path.join(curPath, curtime)

  if(len(args)>1):
      command="stbt batch run -kk -1 -o ./"+curtime+"/"

      for i in range(3,len(args)):
        command+=" "+testFile+"::"+args[i]
        i+=1
  
  
  else:
      testFile=args[0]
      command="stbt batch run -kk -1 -o ./"+curtime+"/"+" "+testFile+"::Menu_Launch_Time_without_VOD_Poster"
      command+=" "+testFile+"::Guide_Launch_Time_without_PIP"
      command+=" "+testFile+"::DVR_Launch "+testFile+"::VODLaunchTimeWithoutBarker"
      command+=" "+testFile+"::infoLaunchWithRightSideTime "+testFile+"::infoLaunchWithoutRightSideTime"
      command+=" "+testFile+"::HD_To_HD_Channel_Change "+testFile+"::SD_To_SD_Channel_Change"
      command+=" "+testFile+"::HD_To_SD_Channel_Change "+testFile+"::channelChangeTime"
  
  '''
  #os.system(command)
  pywalker(curPath,listoflist)
  #produceHTML(listoflist,curPath)
  print"fin"
  #post_request(listoflist,curtime,testCase_dict)
  
if __name__ == "__main__":
   main(sys.argv[0:])












