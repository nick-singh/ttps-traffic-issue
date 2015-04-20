import smtplib

sender = 'nicholas.chamansingh@gmail.com'
receivers = ['nicholas.chamansingh@gmail.com']

message = """From: From Person <nicholas.chamansingh@gmail.com>
To: To Person <nicholas.chamansingh@gmail.com>
Subject: SMTP e-mail test

This is a test e-mail message.
"""

try:
   smtpObj = smtplib.SMTP('localhost')
   smtpObj.sendmail(sender, receivers, message)         
   print "Successfully sent email"
except Exception, e:
   print "Error: unable to send email"
   print e

