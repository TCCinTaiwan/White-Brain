<%@ Page Language="C#" Debug="true" %>
<%@ Import Namespace="System.IO" %>
<html>
<head>
    <title>View saved image</title>
</head>
<body bgcolor="#e0e0e0">
<%
// Get the image data
NameValueCollection fields = Request.Form;
string base64image = fields.Get("base64data");

// check if the image data are not empty
if (base64image != "") {
    // Convert base64 image data to byte array	
    byte[] binImage = System.Convert.FromBase64String(base64image);

    // Save the image to a file
    string fileName = (DateTime.Now.Ticks/1000000)+".png";
    string fullPath = Server.MapPath("./"+fileName);
    FileStream outFile = new FileStream(fullPath,FileMode.Create,FileAccess.Write);                             
    outFile.Write(binImage, 0, binImage.Length);
    outFile.Close();

    // Show the image on the page
    %>  	    
      <h3>The image has been saved on the server as <%=fileName%></h3>
      <img src="<%=fileName%>" border="1">
    <%  	
}
else {
    Response.Write("base64data is not found in the request");
}
%>
</body>
</html>
