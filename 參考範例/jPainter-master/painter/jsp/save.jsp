<%@ page import="java.io.*,org.apache.tomcat.util.buf.Base64" %>
<html>
<head>
    <title>View saved image</title>
</head>
<body bgcolor="#e0e0e0">
<%
File saveDir = new File(application.getRealPath(request.getServletPath())).getParentFile();
String filename = Long.toString(System.currentTimeMillis()/1000)+".png";

// save the image
String base64data = request.getParameter("base64data");
if (base64data != null) {
    // decode the image from base64 and save it
    byte imageBytes[] = (new Base64()).decode(base64data.getBytes());
    OutputStream os = new FileOutputStream(new File(saveDir,filename));
    try {
	os.write(imageBytes);
    }
    finally {
	os.close();
    }

    // show the image on the page
    out.println("<h3>The image has been saved on the server as "+filename+"</h3>");
    out.println("<img src=\""+filename+"\" border=\"1\">");
}
else
    out.println("base64data is not found in the request");
%>
</body>
</html>
