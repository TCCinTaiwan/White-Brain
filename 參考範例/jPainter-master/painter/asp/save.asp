<%@ Language=VBScript %>
<!-- #include file="binsave.asp" -->
<html>
<head>
    <title>View saved image</title>
</head>
<body bgcolor="#e0e0e0">
<%

' Extract image from the form field "image"
ImageData = Request.Form("base64data")

if ImageData <> "" then
    ' Save the image
    ImageFileName = Replace(Time & ".png", ":", "-")
    SaveToBinFile Server.MapPath("./" & ImageFileName), ImageData

    ' Report a success result
    %>  	    
      <h3>The image has been saved on the server as <%=ImageFileName%></h3>
      <img src="<%=ImageFileName%>" border="1">
    <%	
Else
     Response.Write "base64data is not found in the request"
end if
%>
</body>
</html>
