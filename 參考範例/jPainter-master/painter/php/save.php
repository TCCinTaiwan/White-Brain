<html>
<head>
    <title>View saved image</title>
</head>
<body bgcolor="#e0e0e0">
<?php
    if (isset($_POST['base64data'])) {	
	$this_dir = realpath('./');
	if (is_writable($this_dir)) {
	    $filename = time().'.png';

    	    // decode the image from base64 and write to the file
    	    file_put_contents("$this_dir/$filename", base64_decode(chunk_split($_POST['base64data'])) );

	    // display it on the page
   	    echo "<h3>The image has been saved on the server as $filename</h3>";
   	    echo "<img src=\"$filename\" border=1>";
    	}
    	else die("Not enough permissions to write in $this_dir");
    }
    else die("base64data is not found in the request");
?>
</body>
</html>
